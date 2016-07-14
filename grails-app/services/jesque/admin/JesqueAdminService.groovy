package jesque.admin

import grails.plugins.jesque.JesqueService
import grails.transaction.Transactional
import net.greghaines.jesque.Job
import redis.clients.jedis.Jedis
import redis.clients.jedis.SortingParams

@Transactional
class JesqueAdminService {

    def redisService
    JesqueService jesqueService
    def jesqueQueueInfoService

    def getJobListByName(String name, int max, int offset, def sort, def order) {
        def result = [:]
        result.list = []
        redisService.withRedis { Jedis jedis ->
            SortingParams sortingParams = new SortingParams().limit(offset, max)
            if (sort)
                sortingParams = sortingParams.by("jobs:done:*->$sort").desc()
            sortingParams = order == 'desc' ? sortingParams.desc() : sortingParams.asc()

            jedis.sort(jesqueService.getClassesDoneKey(name), sortingParams).each { id ->
                if(id.isNumber())
                    result.list.add(jedis.hgetAll(jesqueService.getDoneKey(id as Long)))
            }
            result.list = result.list.grep()
            result.total = jedis.llen(jesqueService.getClassesDoneKey(name))
        }
        result
    }

    def getJobDetails(long id) {
        def result = [:]
        result.job = redisService.hgetAll(jesqueService.getDoneKey(id))
        if (!result.job)
            return result
        def jobs = getJobListByName(result.job.name as String, 1000, 0, "end", "desc")
        result.jobs = jobs.list
        List runtimes = jobs.list.runtime.collect { it as int }
        result.min = runtimes.min()
        result.max = runtimes.max()
        result.avg = Math.round(runtimes.sum() / runtimes.size())

        def queuedCount = 0
        jesqueQueueInfoService.queueNames.each {
            jesqueQueueInfoService.getQueueInfo(it, 0, Integer.MAX_VALUE).jobs.each { Job queued ->
                if (queued.className == result.job.name)
                    queuedCount++
            }
        }
        result.queued = queuedCount
        result.eta = (queuedCount ?: 1) * result.avg
        result
    }

    def getDoneJobList() {
        redisService.smembers(jesqueService.CLASSES_KEY)
    }

}
