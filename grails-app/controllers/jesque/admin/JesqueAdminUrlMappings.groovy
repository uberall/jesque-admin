package jesque.admin

class JesqueAdminUrlMappings {

    static mappings = {

        "/"(view: "/jesqueAdmin")
        "/jesqueAdmin/api/overview"(controller: 'jesqueAdmin', action: 'overview')
        "/jesqueAdmin/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
        "/jesqueAdmin/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details')
        "/jesqueAdmin/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed')
    }
}
