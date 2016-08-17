package grails.plugins.jesque.admin

import net.greghaines.jesque.meta.WorkerInfo
import org.springframework.http.HttpStatus

class JesqueAdminWorkerController extends AbstractJesqueAdminController {

    def list() {
        jsonRender([list: jesqueWorkersService.allWorkers])
    }

    def manual() {
        def worker = request.JSON
        def clazz
        clazz = grailsApplication.jesqueJobClasses.find { it.shortName == worker.job }
        if (!clazz) {
            jsonRender([status: HttpStatus.BAD_REQUEST, message: "no such jobClass $worker.job"])
        } else {
            jesqueService.startWorker(worker.queue, worker.job, clazz.clazz)
            jsonRender()
        }
    }

    def startWorker() {
        //TODO: FIXME
//        List queue = [params.queueName as String]
//        jesqueService.startWorker(queue, jobFactory)
        flash.success = true
        redirect(action: 'manual')
    }

    def apiHostMap() {
        def hostmap = jesqueWorkersService.workerHostMap
        def sortedMap = [:]
        hostmap.each { String host, List<WorkerInfo> list ->
            def sortedList = list.sort { it1, it2 -> it1.pid <=> it2.pid }
            sortedMap << [(host): sortedList]
        }
        jsonRender(hostmap: sortedMap)
    }

    def apiRemove() {
        jesqueWorkersService.removeWorker(params.name)
        jsonRender([success: 'OK'])
    }

    def apiWorkers() {
        jsonRender([workers: jesqueWorkersService.allWorkers])
    }
}
