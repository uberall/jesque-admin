package jesque.admin

import grails.plugins.jesque.JesqueService

class JesqueAdminController extends AbstractJesqueAdminController {

    JesqueService jesqueService

    def overview() {
        println "starting workers"
        jsonRender([
                queues : jesqueQueuesService.queueInfos,
                workers: jesqueWorkersService.allWorkers,
                failed : jesqueFailureService.count
        ])
    }
}
