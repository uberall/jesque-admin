package jesque.admin

import grails.converters.JSON
import grails.plugins.jesque.ScheduledJobDaoService
import grails.transaction.Transactional
import redis.clients.jedis.Jedis

@Transactional
class JesqueScheduledService {

    ScheduledJobDaoService scheduledJobDaoService
    def redisService

    def getAll() {
        scheduledJobDaoService.getAll()
    }

    def delete(String name) {
        scheduledJobDaoService.delete(name)
    }

    def getScheduledJobs() {
        def jobs = []
        redisService.withRedis { Jedis jedis ->
            jedis.smembers("resque:delayed:queues").collect { queueName ->
                jedis.zrevrange("resque:delayed:$queueName", 0, Long.MAX_VALUE).each { time ->
                    jedis.lrange("resque:delayed:$queueName:$time", 0, jedis.llen("resque:delayed:$queueName:$time")).each { jobString ->
                        def job = JSON.parse(jobString)
                        job.time = time
                        job.queue = queueName
                        jobs << job
                    }
                }
            }
        }
        jobs.sort{it.time}
    }

}
