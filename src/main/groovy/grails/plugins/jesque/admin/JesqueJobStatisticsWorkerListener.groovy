package grails.plugins.jesque.admin

import grails.core.GrailsApplication
import grails.core.support.GrailsApplicationAware
import groovy.transform.CompileStatic
import net.greghaines.jesque.Job
import net.greghaines.jesque.worker.Worker
import net.greghaines.jesque.worker.WorkerEvent
import net.greghaines.jesque.worker.WorkerListener

@CompileStatic
class JesqueJobStatisticsWorkerListener implements WorkerListener, GrailsApplicationAware {

    JesqueStatisticsService jesqueStatisticsService
    Long start = new Long(0)

    @Override
    void onEvent(WorkerEvent event, Worker worker, String queue, Job job, Object runner, Object result, Throwable t) {
        if (event == WorkerEvent.JOB_EXECUTE)
            start = System.currentTimeMillis()
        else if (event == WorkerEvent.JOB_SUCCESS)
            done(job, queue, true, job.args)
        else if (event == WorkerEvent.JOB_FAILURE)
            done(job, queue, false, job.args, t)
    }

    private void done(Job job, String queue, boolean success, def args = null, Throwable t = null) {
        try {
            long end = System.currentTimeMillis()
            jesqueStatisticsService.addStatistic(job, queue, start, end, args, success, t)
        } finally {
            // clearing listener for next job run
            start = 0
        }
    }

    @Override
    void setGrailsApplication(GrailsApplication grailsApplication) {
        jesqueStatisticsService = grailsApplication.mainContext.getBean('jesqueStatisticsService') as JesqueStatisticsService
    }
}
