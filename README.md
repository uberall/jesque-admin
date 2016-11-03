# jesque-admin

A User interface for [Jesque|https://grails.org/plugins.html#plugin/jesque] powered by grails and react.

# Installation

Just add jesque-admin to your dependencies

```
dependencies {
    ...
    compile 'org.grails.plugins:jesque-admin:0.6.5'
}
```

# Usage

Make sure that jesque is enabled. If you do not have the "default mapping for controllers" in your UrlMappings.groovy you will have to add mappings for jesque-admin to your UrlMappings.groovy
This plugin does not expose any UrlMappings by itself for security reasons. Job payloads can hold sensitive data and having an "open" jesque-admin interface can lead to breaches.

```
"/jesque/"(controller: 'jesqueAdmin', action: 'index')
"/jesque/api/overview"(controller: 'jesqueAdmin', action: 'overview')
"/jesque/api/queues"(controller: 'jesqueAdminQueue', action: 'list')
"/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'details', method: "GET")
"/jesque/api/queues/$name"(controller: 'jesqueAdminQueue', action: 'remove', method: "DELETE")
"/jesque/api/jobs"(controller: 'jesqueAdminStatistics', action: 'jobs', method: "GET")
"/jesque/api/jobs"(controller: 'jesqueAdminJob', action: 'enqueue', method: "POST")
"/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'failed', method: "GET")
"/jesque/api/jobs/failed/$id"(controller: 'jesqueAdminJob', action: 'retry', method: "POST")
"/jesque/api/jobs/failed/$id"(controller: 'jesqueAdminJob', action: 'remove', method: "DELETE")
"/jesque/api/jobs/failed"(controller: 'jesqueAdminJob', action: 'clear', method: "DELETE")
"/jesque/api/jobs/delayed"(controller: 'jesqueAdminJob', action: 'delayed', method: "GET")
"/jesque/api/jobs/triggers"(controller: 'jesqueAdminJob', action: 'triggers', method: "GET")
"/jesque/api/jobs/triggers/$name"(controller: 'jesqueAdminJob', action: 'deleteTrigger', method: "DELETE")
"/jesque/api/jobs/$job"(controller: 'jesqueAdminStatistics', action: 'list', method: "GET")
"/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'list', method: 'GET')
"/jesque/api/workers"(controller: 'jesqueAdminWorker', action: 'manual', method: 'POST')
"/jesque/api/workers/$name"(controller: 'jesqueAdminWorker', action: 'remove', method: 'DELETE')
"/jesque/api/workers/pause"(controller: 'jesqueAdminWorker', action: 'pause', method: 'GET')
"/jesque/api/workers/resume"(controller: 'jesqueAdminWorker', action: 'resume', method: 'GET')
```

You can freely change "/jesque/api/" to whatever you want but i highly recommend not to change anything that comes after that.

# Job Statistics

jesque-admin comes with mechanics to gather statistics like start, end and runtimes of Jobs. All this is done by using a Special Job Listener.
If you are already using a custom JesqueWorker all you have to do is enable the feature and let your custom worker extend "JesqueJobStatisticsCollectingWorkerImpl" instead of the 
default WorkerImpl coming with grails-jesque and enable the statistics collecting feature in you application.yml (or groovy)

```
grails:
    jesque:
        statistics:
          enabled: true
          max: 100 // the maximum number of jobs PER JOB CLASS to store
```

If you are not yet using a custom Jesque Worker you have to tell grails-jesque to use JesqueJobStatisticsCollectingWorkerImpl as a custom worker impl

```
grails:
    jesque:
        enabled: true
        custom:
          worker:
            clazz: JesqueJobStatisticsCollectingWorkerImpl
```

After restarting your App you should find a list menu item under "jobs" in jesque-admin which lets you browse past jobs being processed. 

# Development

If you want to extend jesque-admin or help developing it further simply start by:

1. Run `gradle bootRun -Djesque.admin.devel=true` (or `grails run-app` or run the main method in Application.groovy whatever you prefer)
2. Run `npm i` in the root folder of this plugin
3. Run `npm run devel`
