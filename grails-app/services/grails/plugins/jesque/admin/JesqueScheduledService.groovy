package grails.plugins.jesque.admin

import grails.plugins.jesque.ScheduledJobDaoService

class JesqueScheduledService {

    ScheduledJobDaoService scheduledJobDaoService

    def getAll() {
        scheduledJobDaoService.getAll()
    }

    void delete(String name) {
        scheduledJobDaoService.delete(name)
    }

}