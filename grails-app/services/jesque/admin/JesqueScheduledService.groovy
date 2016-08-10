package jesque.admin

import grails.converters.JSON
import grails.plugins.jesque.ScheduledJobDaoService
import grails.transaction.Transactional
import redis.clients.jedis.Jedis

@Transactional
class JesqueScheduledService {

    ScheduledJobDaoService scheduledJobDaoService
    def redisService

    private static final String DELAYED_BASE_KEY = "resque:delayed"

    def getAll() {
        scheduledJobDaoService.getAll()
    }

    void delete(String name) {
        scheduledJobDaoService.delete(name)
    }

    def getDelayedQueues() {
        redisService.smembers('resque:delayed:queues')
    }

    def getDelayedJobs(String queue, long offset, long max) {
        def jobs = []
        String key = getDelayedKey(queue)
        redisService.withRedis { Jedis jedis ->
            // each queue has a zset of times that it has jobs to do for
            jedis.zrevrange(key, offset, offset + (max - 1)).each { time ->
                jedis.lrange("$key:$time", 0, jedis.llen("$key:$time")).each { jobString ->
                    def job = JSON.parse(jobString)
                    job.time = time
                    jobs << job
                }
            }
        }
        jobs.sort { it.time }
    }

    String getDelayedKey(String queue) {
        "$DELAYED_BASE_KEY:$queue"
    }

}