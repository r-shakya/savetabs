$(function () {

    var tabsData = [];

    chrome.storage.sync.get('savetabs', function (data) {

        var projectsData = [];

        if (data.savetabs) {

            var jsonData = JSON.parse(data.savetabs);

            projectsData = jsonData;

            let text = "";
            let projectText = "";

            projectsData.forEach(function (project, index) {
                tabsData.push(project);

                projectText += `<option value="${index}">${project.projectName}</option>`

                text += `<div class="col-auto card mx-2 my-3" id="project">
                <div class="row mt-3">
            <div class="col-6">
                <h3>${project.projectName}</h3>
            </div>
            <div class="col-6 text-center">
                <input id="p${index}" type="submit" class="btn btn-primary" value="open">
            </div>
        </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Tabs</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody id="projectBody">
                    `
                project.projectData.forEach(function (tab, index) {
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
                text += `
                </tbody>
            </table>
            <div class="row mb-3" id="projectBottom">
                <div class="col-6">
                    <input type="text" class="form-control" id="tabUrl" placeholder="Enter URL">
                </div>
                <div class="col-6">
                    <button id="addTab" class="btn btn-primary">add</button>
                </div>
            </div>
        </div>`

            });

            document.getElementById('fillProjectsName').innerHTML = projectText;
            document.getElementById('fillProjects').innerHTML = text;
        }
    });

    $('#addProject').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        tabsData[projectId].projectData.forEach(function (tab, index) {
            window.open(tab.url);
        });
    });

    $('#deleteProject').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        chrome.storage.sync.get('savetabs', function (data) {

            if (data.savetabs) {

                var jsonData = JSON.parse(data.savetabs);

                var spliced = jsonData.splice(projectId, 1);

                chrome.storage.sync.set({ 'savetabs': JSON.stringify(jsonData) }, function () {

                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: spliced[0].projectName + " deleted!",
                        message: spliced[0].projectName + " deleted successfully!"
                    }

                    chrome.notifications.create('limitNotification', notifOptions);

                });
            }
        });
    });

    // $('#addTab').click(function () {
    //     // var projectId = $('#fillProjectsName').val();
    //     // projectId = parseInt(projectId);

    //     $.ajax({
    //         url: "http://textance.herokuapp.com/title/https://github.com/r-shakya/tool-development/blob/master/GIP/templates/index.html",
    //         complete: function (data) {

    //             var notifOptions = {
    //                 type: 'basic',
    //                 iconUrl: 'icon48.png',
    //                 title: data.responseText + " deleted!",
    //                 message: data.responseText + " deleted successfully!"
    //             }

    //             chrome.notifications.create('limitNotification', notifOptions);
    //         }
    //     });

    //     // chrome.storage.sync.get('savetabs', function (data) {

    //     //     if (data.savetabs) {

    //     //         var jsonData = JSON.parse(data.savetabs);

    //     //         chrome.storage.sync.set({ 'savetabs': JSON.stringify(jsonData) }, function () {

    //     //         });
    //     //     }
    //     // });
    // });
});