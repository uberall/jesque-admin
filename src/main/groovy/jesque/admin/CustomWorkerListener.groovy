package jesque.admin

import groovy.util.logging.Slf4j
import net.greghaines.jesque.Job
import net.greghaines.jesque.worker.Worker
import net.greghaines.jesque.worker.WorkerEvent
import net.greghaines.jesque.worker.WorkerListener

@Slf4j
class CustomWorkerListener implements WorkerListener {

    @Override
    void onEvent(WorkerEvent event, Worker worker, String queue, Job job, Object runner, Object result, Throwable t) {
        log.debug("$event")
    }
}
