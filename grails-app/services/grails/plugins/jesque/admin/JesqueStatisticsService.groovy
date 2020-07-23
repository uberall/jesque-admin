package grails.plugins.jesque.admin

import grails.core.GrailsApplication
import grails.plugins.redis.RedisService
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import net.greghaines.jesque.Job
import redis.clients.jedis.Transaction

class JesqueStatisticsService {

    private static final String CLASSES_KEY = 'job:statistic' // we're using the same namespace as the grails-jesque-plugin
    private static final int DEFAULT_MAX = 10000 // number of entries to keep per job

    RedisService redisService
    GrailsApplication grailsApplication

    List<JesqueJobStatistic> getStatistics(String job, offset = 0, max = 100) {
        List<String> items = redisService.lrange(getClassesDoneKey(job), offset, offset + (max - 1))
        items.collect { new JsonSlurper().parseText(it) as JesqueJobStatistic }
    }

    long getStatisticCount(String job) {
        redisService.llen(getClassesDoneKey(job))
    }

    @CompileStatic
    void addStatistic(Job job, String queue, long start, long end, def args, boolean success, Throwable t) {
        if (!enabled) return

        String jobName = job.className
        JesqueJobStatistic stats = new JesqueJobStatistic(
                job: jobName,
                queue: queue,
                start: start,
                end: end,
                runtime: end - start,
                args: args,
                success: success,
                throwable: t
        )

        String key = getClassesDoneKey(jobName)
        String json = stats.asJsonString()
        redisService.withTransaction { Transaction transaction ->
            transaction.lpush(key, json)
            transaction.ltrim(key, 0L, max-1)
        }
    }

    private int getMax() {
        grailsApplication.config.grails.jesque.statistics?.max ?: DEFAULT_MAX
    }

    private boolean isEnabled() {
        grailsApplication.config.grails.jesque.statistics?.enabled ?: false
    }

    @CompileStatic
    private static String getClassesDoneKey(String name) {
        "$CLASSES_KEY:$name"
    }
}
