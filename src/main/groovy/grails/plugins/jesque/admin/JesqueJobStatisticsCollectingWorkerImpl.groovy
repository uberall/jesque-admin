package grails.plugins.jesque.admin

import grails.core.GrailsApplication
import grails.plugins.jesque.GrailsWorkerImpl
import groovy.util.logging.Slf4j
import net.greghaines.jesque.Config
import redis.clients.jedis.Jedis
import redis.clients.util.Pool

@Slf4j
class JesqueJobStatisticsCollectingWorkerImpl extends GrailsWorkerImpl {

    JesqueJobStatisticsCollectingWorkerImpl(GrailsApplication grailsApplication, Config config, Collection<String> queues, Map<String, ? extends Class> jobTypes) {
        super(grailsApplication, config, queues, jobTypes)
    }

    JesqueJobStatisticsCollectingWorkerImpl(GrailsApplication grailsApplication, Config config, Pool<Jedis> jedisPool, Collection<String> queues, Map<String, ? extends Class> jobTypes) {
        super(grailsApplication, config, jedisPool, queues, jobTypes)
        JesqueStatisticsService jesqueStatisticsService = grailsApplication.mainContext.getBean('jesqueStatisticsService')
        if (jesqueStatisticsService.enabled) {
            log.info "adding JesqueJobStatisticsWorkerListener to listeners"
            this.workerEventEmitter.addListener(new JesqueJobStatisticsWorkerListener(grailsApplication))
        } else {
            log.warn("Jesque job statistic collection is disabled, not adding listener")
        }
    }

}
