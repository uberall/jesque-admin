package jesque.admin

import grails.core.GrailsApplication
import grails.plugins.jesque.GrailsWorkerImpl
import groovy.util.logging.Slf4j
import net.greghaines.jesque.Config
import net.greghaines.jesque.Job
import net.greghaines.jesque.worker.WorkerAware
import redis.clients.jedis.Jedis
import redis.clients.util.Pool

import static net.greghaines.jesque.utils.ResqueConstants.WORKER
import static net.greghaines.jesque.utils.ResqueConstants.WORKER
import static net.greghaines.jesque.worker.WorkerEvent.JOB_EXECUTE

@Slf4j
class CustomWorkerImpl extends GrailsWorkerImpl {

    CustomWorkerImpl(GrailsApplication grailsApplication, Config config, Collection<String> queues, Map<String, ? extends Class> jobTypes) {
        super(grailsApplication, config, queues, jobTypes)
    }

    CustomWorkerImpl(GrailsApplication grailsApplication, Config config, Pool<Jedis> jedisPool, Collection<String> queues, Map<String, ? extends Class> jobTypes) {
        super(grailsApplication, config, jedisPool, queues, jobTypes)
    }


    @Override
    protected void execute(final Job job, final String curQueue, final Object instance, final Object[] args) {
        this.jedisClient.set(key(WORKER, this.name), statusMsg(curQueue, job))
        try {
            log.info "Running perform on instance ${job.className} in ${this.class.simpleName}"
            final Object result
            this.listenerDelegate.fireEvent(JOB_EXECUTE, this, curQueue, job, instance, null, null)
            result = instance.perform(*args)
            success(job, instance, result, curQueue)
        } finally {
            this.jedisClient.del(key(WORKER, this.name))
        }
    }

}
