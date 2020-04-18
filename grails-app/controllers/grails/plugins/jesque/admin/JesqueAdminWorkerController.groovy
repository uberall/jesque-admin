package grails.plugins.jesque.admin

import org.springframework.http.HttpStatus

class JesqueAdminWorkerController extends AbstractJesqueAdminController {

    def redisService

    def list() {
        jsonRender([list: workerInfoDao.allWorkers])
    }

    def manual() {
        def worker = request.JSON
        def clazzes = grailsApplication.jesqueJobClasses.findAll { it.shortName in worker.jobs }
        if (!clazzes) {
            jsonRender([status: HttpStatus.BAD_REQUEST, message: "no job found for classes $worker.jobs"])
            return
        }

        def classMap = clazzes.collectEntries { [(it.clazz.simpleName): it.clazz] } as Map
        String queue = worker.queue
        // we create the queue, so it's already available for selection on the manual job enqueue page
        redisService.sadd('resque:queues', queue)
        jesqueService.startWorker(queue, classMap)
        jsonRender([success: true])
    }

    def remove() {
        workerInfoDao.removeWorker(params.name)
        jsonRender([success: true])
    }

    def pause() {
        jesqueService.pauseAllWorkersInCluster()
        jsonRender([success: true])
    }

    def resume() {
        jesqueService.resumeAllWorkersInCluster()
        jsonRender([success: true])
    }

}
