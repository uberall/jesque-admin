<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
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
        },
        isMonitoringEnabled: ${grailsApplication.config.grails.jesque.statistics?.enabled == true},
        knownJobs: ${raw((grailsApplication.jesqueJobClasses.clazz.simpleName as grails.converters.JSON).toString())}
    }
</script>
<g:if test="${grails.util.Environment.developmentMode}">
    <script type="application/javascript" src="http://localhost:3000/jesqueAdmin.js"></script>
</g:if>
<g:else>
    <asset:javascript src="jesqueAdmin.js"/>
</g:else>
</body>
</html>
