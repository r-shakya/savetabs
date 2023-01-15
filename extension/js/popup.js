$(function () {

    //saveproject tab functionality
    var tabsData = [];

    //get all tabs in current window
    chrome.tabs.query({ currentWindow: true }, function (tabs) {

        let text = "";

        tabs.forEach(function (tab, index) {
            if(tab.title!="New Tab"){
                tabsData.push({ title: tab.title, url: tab.url });
                text += `<tr>
                            <td class="tab-name">${tab.title}</td>
                            <td>
                                <input type="checkbox" class="form-check-input" id="${index}" checked> add
                            </td>
                        </tr>`
            }
        });

        if(text){
            document.getElementById('fillTabs').innerHTML = text;
        }
        else{
            document.getElementById('fillTabs').innerHTML = '<tr><td>no open tabs found</td></tr>';
        }

    });

    //save all tabs as a project
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
                            iconUrl: 'icons/icon48.png',
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
                        iconUrl: 'icons/icon48.png',
                        title: projectName + " added!",
                        message: projectName + " saved successfully!"
                    }

                    chrome.notifications.create('limitNotification', notifOptions);

                });
            }

            window.location.reload();

        });

    });

    //openproject tab functionality

    var projects = [];

    //show all projects
    chrome.storage.local.get('savetabs', function (data) {

        if (data.savetabs) {

            projects = JSON.parse(data.savetabs);

            let projectText = "";

            projects.forEach(function (project, index) {

                projectText += `<tr>
                                    <td class="project-name">${project.projectName}</td>
                                    <td>
                                        <input type="checkbox" class="form-check-input" id="project-${index}">
                                    </td>
                                </tr>`

            });

            if(projectText){
                document.getElementById('openTabs').innerHTML = projectText;
            }
            else{
                document.getElementById('openTabs').innerHTML = '<tr><td>no project found</td></tr>';
            }

        }
        else{
            document.getElementById('openTabs').innerHTML = '<tr><td>no project found</td></tr>';
        }
    });

    //open selected projects
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

    //delete selected projects
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
                iconUrl: 'icons/icon48.png',
                title: "deleted successfully!",
                message: text + "deleted successfully!"
            }

            chrome.notifications.create('limitNotification', notifOptions);

            window.location.reload();

        });

    });

});