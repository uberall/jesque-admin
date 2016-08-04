package jesque.admin

import grails.plugins.jesque.JesqueService

class JesqueAdminController extends AbstractJesqueAdminController {

    JesqueService jesqueService

    def overview() {
        jsonRender([
                queues : jesqueQueuesService.queueInfos,
                workers: jesqueWorkersService.allWorkers,
                failed : jesqueFailureService.count
        ])
    }
}
