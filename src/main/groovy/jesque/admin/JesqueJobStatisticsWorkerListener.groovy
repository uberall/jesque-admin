package jesque.admin

import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import net.greghaines.jesque.Job
import net.greghaines.jesque.worker.Worker
import net.greghaines.jesque.worker.WorkerEvent
import net.greghaines.jesque.worker.WorkerListener

import java.util.concurrent.atomic.AtomicLong

@Slf4j
class JesqueJobStatisticsWorkerListener implements WorkerListener {

    JesqueStatisticsService jesqueStatisticsService
    AtomicLong start

    JesqueJobStatisticsWorkerListener(GrailsApplication grailsApplication) {
        jesqueStatisticsService = grailsApplication.mainContext.getBean('jesqueStatisticsService') as JesqueStatisticsService
        start = new AtomicLong(0)
    }

    @Override
    void onEvent(WorkerEvent event, Worker worker, String queue, Job job, Object runner, Object result, Throwable t) {
        if (event == WorkerEvent.JOB_EXECUTE)
            start.set(System.currentTimeMillis())
        else if (event == WorkerEvent.JOB_SUCCESS)
            done(job, queue, true, job.args)
        else if (event == WorkerEvent.JOB_FAILURE)
            done(job, queue, false, job.args, t)
    }

    private void done(Job job, String queue, boolean success, def args = null, Throwable t = null) {
        long end = System.currentTimeMillis()
        if (!start.get()) {
            log.warn("done called without start being set")
            return
        }

        jesqueStatisticsService.addStatistic(job, queue, start.get(), end, args, success, t)

        // clearing listener for next job run
        start.set(0)
    }

}
