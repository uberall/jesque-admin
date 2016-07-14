package jesque.admin

import grails.plugins.jesque.JobExceptionHandler
import groovy.util.logging.Slf4j
import net.greghaines.jesque.Job

@Slf4j
class CustomWorkerExceptionHandler implements JobExceptionHandler {

    @Override
    Object onException(Exception e, Job job, String curQueue) {
        log.error("$job.className failed: $e.message")
    }
}
