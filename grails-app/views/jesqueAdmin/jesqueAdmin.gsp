<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>JesqueAdmin</title>
</head>

<body>
<div id="jesque-admin-container"></div>
<script type="application/javascript">
    window.AppConfig = {
        links: {
            overview: "${g.createLink(controller: 'jesqueAdmin', action: 'overview')}",
            queues: "${g.createLink(controller: 'jesqueAdminQueue', action: 'list')}",
            failed: "${g.createLink(controller: 'jesqueAdminJob', action: 'failed')}",
            triggers: "${g.createLink(controller: 'jesqueAdminJob', action: 'triggers')}",
            jobs: "${g.createLink(controller: 'jesqueAdminStatistics', action: 'jobs')}",
            delayed: "${g.createLink(controller: 'jesqueAdminJob', action: 'delayed')}",
            workers: "${g.createLink(controller: 'jesqueAdminWorker', action: 'list')}",
            workerManual: "${g.createLink(controller: 'jesqueAdminWorker', action: 'manual')}"
        },
        isMonitoringEnabled: ${grailsApplication.config.grails.jesque.statistics?.enabled == true},
        knownJobs: ${raw((grailsApplication.jesqueJobClasses.clazz.simpleName as grails.converters.JSON).toString())}
    }
</script>
    %{--<script type="application/javascript" src="http://localhost:3000/jesqueAdmin.js"></script>--}%
    <asset:javascript src="jesqueAdmin.js"/>
</body>
</html>
