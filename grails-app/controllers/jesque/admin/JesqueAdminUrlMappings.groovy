package jesque.admin

class JesqueAdminUrlMappings {

    static mappings = {

        "/"(view: "/jesqueAdmin")
        "/jesqueAdmin/api/overview"(controller: 'jesqueAdmin', action: 'overview')
        "/jesqueAdmin/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
        "/jesqueAdmin/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details')
        "/jesqueAdmin/api/jobs"(controller: 'jesqueAdminStatistics', action: 'jobs', method: "GET")
        "/jesqueAdmin/api/jobs"(controller: 'jesqueAdminJob', action: 'enqueue', method: "POST")
        "/jesqueAdmin/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed', method: "GET")
        "/jesqueAdmin/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'clear', method: "DELETE")
        "/jesqueAdmin/api/jobs/$job"(controller: 'jesqueAdminStatistics', action: 'list', method: "GET")
    }
}
