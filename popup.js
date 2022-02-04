$(function () {

    var tabsData = [];
    let text = "";

    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        tabs.forEach(function (tab, index) {
            tabsData.push({ title: tab.title, url: tab.url });
            text += `<tr>
                <td>${tab.title}</td>
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="${index}" checked>
                        <label class="form-check-label" for="${index}">add</label>
                    </div>
                </td>
            </tr>`
        });
        document.getElementById('fillTabs').innerHTML = text;
    });

    var projects = [];

    chrome.storage.local.get('savetabs', function (data) {

        if (data.savetabs) {

            var jsonData = JSON.parse(data.savetabs);

            projects = jsonData;

            let projectText = "";

            projects.forEach(function (project, index) {

                projectText += `<tr>
                <td>${project.projectName}</td>
                <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="project-${index}">
                        <label class="form-check-label" for="${index}">mark</label>
                    </div>
                </td>
            </tr>`

            });

            document.getElementById('openTabs').innerHTML = projectText;
        }
    });

    $('#openProject').click(function () {

        var projectToBeOpened = [];

        projects.forEach(function (project, index) {
            var checkbox = document.getElementById("project-" + index);
            if (checkbox.checked) {
                projectToBeOpened.push(project);
            }
        });

        projectToBeOpened.forEach(function (project, index) {

            chrome.windows.create({}, function (wdata) {

                project.projectData.forEach(function (tab, index1) {

                    chrome.tabs.create({ windowId: wdata.id, url: tab.url, index: 0 }, function (data) {

                    });

                });

            });

        });

    });

    $('#deleteProject').click(function () {

        var ProjectsRemained = [];
        let text = "";

        projects.forEach(function (project, index) {
            var checkbox = document.getElementById("project-" + index);
            if (!checkbox.checked) {
                ProjectsRemained.push(project);
            }
            else {
                text += project.projectName + " ";
            }
        });

        chrome.storage.local.set({ 'savetabs': JSON.stringify(ProjectsRemained) }, function () {

            var notifOptions = {
                type: 'basic',
                iconUrl: 'icon48.png',
                title: "deleted successfully!",
                message: text + "deleted successfully!"
            }

            chrome.notifications.create('limitNotification', notifOptions);

        });

    });



    $('#saveProject').click(function () {

        var dataToBeSaved = [];

        tabsData.forEach(function (tab, index) {
            var checkbox = document.getElementById("" + index);
            if (checkbox.checked) {
                dataToBeSaved.push(tab);
            }
        });

        var projectName = $('#projectName').val();

        chrome.storage.local.get(['savetabs'], function (data) {

            var projectsData = [];

            var addData = {
                projectName: projectName,
                projectData: dataToBeSaved
            }

            projectsData.push(addData);

            if (data.savetabs) {

                var jsonData = JSON.parse(data.savetabs);
                var projectsData1 = projectsData.concat(jsonData);

                chrome.storage.local.set({ 'savetabs': JSON.stringify(projectsData1) }, function () {

                    var error = chrome.runtime.lastError;

                    if (error) {
                        alert(error.message);
                    }

                    else{
                        var notifOptions = {
                            type: 'basic',
                            iconUrl: 'icon48.png',
                            title: projectName + " added!",
                            message: projectName + " saved successfully!"
                        }
    
                        chrome.notifications.create('limitNotification', notifOptions);
                    }

                });
            }
            else {
                chrome.storage.local.set({ 'savetabs': JSON.stringify(projectsData) }, function () {

                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: projectName + " added!",
                        message: projectName + " saved successfully!"
                    }

                    chrome.notifications.create('limitNotification', notifOptions);

                });
            }

        });

    });

});