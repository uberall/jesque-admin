<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>JesqueAdmin</title>
</head>

<body>
<g:if test="${grailsApplication.config.grails.jesque.enabled}">
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
    <g:if test="${System.getProperty('jesque.admin.devel') == 'true'}">
        <script type="application/javascript" src="http://localhost:3000/jesqueAdmin.js"></script>
    </g:if>
    <g:else>
        <asset:javascript src="jesqueAdmin.js"/>
    </g:else>
</g:if>
<g:else>
    <h1>Jesque is Disabled.</h1>
</g:else>
</body>
</html>
