package grails.plugins.jesque.admin

class JesqueAdminUrlMappings {

    static mappings = {

        "/jesque/"(controller: 'jesqueAdmin', action: 'index')
        "/jesque/api/overview"(controller: 'jesqueAdmin', action: 'overview')
        "/jesque/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
        "/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details', method: "GET")
        "/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'remove', method: "DELETE")
        "/jesque/api/jobs"(controller: 'jesqueAdminStatistics', action: 'jobs', method: "GET")
        "/jesque/api/jobs"(controller: 'jesqueAdminJob', action: 'enqueue', method: "POST")
        "/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed', method: "GET")
        "/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'clear', method: "DELETE")
        "/jesque/api/jobs/delayed"(controller: 'jesqueAdminJob', action: 'delayed', method: "GET")
        "/jesque/api/jobs/triggers"(controller: 'jesqueAdminJob', action: 'triggers', method: "GET")
        "/jesque/api/jobs/triggers/$name"(controller: 'jesqueAdminJob', action: 'deleteTrigger', method: "DELETE")
        "/jesque/api/jobs/$job"(controller: 'jesqueAdminStatistics', action: 'list', method: "GET")
        "/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'list', method: 'GET')
        "/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'manual', method: 'POST')
    }
}
