package jesque.test

class UrlMappings {

    static mappings = {

        "/jesque/"(controller: 'jesqueAdmin', action: 'index')
        "/jesque/api/overview"(controller: 'jesqueAdmin', action: 'overview')
        "/jesque/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
        "/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details', method: "GET")
        "/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'remove', method: "DELETE")
        "/jesque/api/jobs"(controller: 'jesqueAdminStatistics', action: 'jobs', method: "GET")
        "/jesque/api/jobs"(controller: 'jesqueAdminJob', action: 'enqueue', method: "POST")
        "/jesque/api/jobs/removeDelayed"(controller: 'jesqueAdminJob', action: 'removeDelayed', method: "POST")
        "/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed', method: "GET")
        "/jesque/api/jobs/failed/$id"(controller: 'jesqueAdminJob', action: 'retry', method: "POST")
        "/jesque/api/jobs/failed/$id"(controller: 'jesqueAdminJob', action: 'remove', method: "DELETE")
        "/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'clear', method: "DELETE")
        "/jesque/api/jobs/triggers"(controller: 'jesqueAdminJob', action: 'triggers', method: "GET")
        "/jesque/api/jobs/triggers/$name"(controller: 'jesqueAdminJob', action: 'deleteTrigger', method: "DELETE")
        "/jesque/api/jobs/$job"(controller: 'jesqueAdminStatistics', action: 'list', method: "GET")
        "/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'list', method: 'GET')
        "/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'manual', method: 'POST')
        "/jesque/api/workers/$name"(controller: 'jesqueAdminWorker', action: 'remove', method: 'DELETE')
        "/jesque/api/workers/pause"(controller: 'jesqueAdminWorker', action: 'pauseAll', method: 'GET')
        "/jesque/api/workers/pause/$channel"(controller: 'jesqueAdminWorker', action: 'pauseChannel', method: 'GET')
        "/jesque/api/workers/resume"(controller: 'jesqueAdminWorker', action: 'resumeAll', method: 'GET')
        "/jesque/api/workers/resume/$channel"(controller: 'jesqueAdminWorker', action: 'resumeChannel', method: 'GET')
    }
}
