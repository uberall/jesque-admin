package jesque.admin

import grails.converters.JSON
import grails.core.GrailsApplication
import grails.plugins.redis.RedisService
import grails.transaction.Transactional
import net.greghaines.jesque.Job
import redis.clients.jedis.Jedis

@Transactional
class JesqueStatisticsService {

    private static final String CLASSES_KEY = 'jesque:job:statistic'
    private static final int DEFAULT_MAX = 10000 // number of entries to keep per job

    RedisService redisService
    GrailsApplication grailsApplication

    List<String> getJobNames() {
        Set set = redisService.keys("$CLASSES_KEY:*")
        List result = set.sort().collect { it - "$CLASSES_KEY:" }
        result
    }

    List<JesqueJobStatistic> getStatistics(String job, offset = 0, max = 100) {
        List<String> items = redisService.lrange(getClassesDoneKey(job), offset, offset + (max - 1))
        items.collect { JSON.parse(it) as JesqueJobStatistic }
    }

    long getStatisticCount(String job) {
        redisService.llen(getClassesDoneKey(job))
    }

    void addStatistic(Job job, String queue, long start, long end, def args, boolean success, Throwable t) {
        if (enabled) {
            String jobName = getJobName(job)
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
            redisService.withRedis { Jedis jedis ->
                String key = getClassesDoneKey(getJobName(job))
                jedis.lpush(key, stats.asJsonString())
                jedis.ltrim(key, 0L, max-1)
            }
        }
    }


    int getMax() {
        grailsApplication.config.grails.jesque.statistics?.max ?: DEFAULT_MAX
    }

    boolean isEnabled() {
        grailsApplication.config.grails.jesque.statistics?.enabled ?: false
    }

    static String getJobName(Job job) {
        return job.className
    }

    static String getClassesDoneKey(String name) {
        "$CLASSES_KEY:$name"
    }
}
