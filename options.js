$(function () {

    var tabsData = [];

    // show all projects
    chrome.storage.local.get('savetabs', function (data) {

        var projectsData = [];

        if (data.savetabs) {

            var jsonData = JSON.parse(data.savetabs);

            projectsData = jsonData;

            let text = "";
            let projectText = "";

            projectsData.forEach(function (project, index) {
                tabsData.push(project);

                projectText += `<option value="${index}">${project.projectName}</option>`

                text += `
                <div class="col-auto card mx-2 my-3" id="project">
                <form id="${project.projectName}" action="" method="POST">
                <div class="row mt-3">
            <div class="col-6">
                <h3 class="project-name">${project.projectName}</h3>
            </div>
            <div class="col-6">
                <input type="submit" class="btn btn-primary submit-buttons" name="role" value="open" />
            </div>
        </div>
        <div class="projectBody row">
        <div class="col">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Tabs</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    `
                project.projectData.forEach(function (tab, i) {
                    text += `<tr>
                            <td>${tab.title}</td>
                            <td>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" name="${project.projectName + "-tab-" + i}" id="${project.projectName + "-tab-" + i}" checked>
                                    <label class="form-check-label" for="${project.projectName + "-tab-" + i}">add</label>
                                </div>
                            </td>
                        </tr>`
                });
                text += `
                </tbody>
            </table>
            </div>
            </div>
            <div class="row mb-3" id="projectBottom">
                <hr>
                <div class="col-8">
                    <input type="text" class="form-control" id="tabUrl" name="tabUrl" placeholder="Enter URL">
                </div>
                <div class="col-4">
                    <input type="submit" class="btn btn-primary submit-buttons" name="role" value="add" />
                </div>
            </div>
            </form>
        </div>`

            });

            document.getElementById('fillProjectsName').innerHTML = projectText;
            document.getElementById('fillProjects').innerHTML = text;
        }
    });

    // open project
    $('#openProject').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        tabsData[projectId].projectData.forEach(function (tab, index) {
            window.open(tab.url);
        });
    });

    // delete project
    $('#deleteProject').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        chrome.storage.local.get('savetabs', function (data) {

            if (data.savetabs) {

                var jsonData = JSON.parse(data.savetabs);

                var spliced = jsonData.splice(projectId, 1);

                chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData) }, function () {

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

    //iterate through all project and implement all functionality - add-tab,
    chrome.storage.local.get('savetabs', function (data) {

        if (data.savetabs) {

            var projectsData = JSON.parse(data.savetabs);

            projectsData.forEach(function (project, index) {

                $("#" + project.projectName).submit(function (e) {

                    e.preventDefault();

                    var inputsData = $(this).serializeArray();

                    // Get the submit button element
                    var btn = $(this).find("input[type=submit]:focus");
                    var role = btn[0].value;

                    if (role == "add") {

                        var urlToBeAdded = "";
                        var titletobeAdded = "";

                        inputsData.forEach(function (obj, idx) {
                            if (obj.name == "tabUrl") {
                                urlToBeAdded = obj.value;
                            }
                        });

                        $.ajax({
                            url: urlToBeAdded,
                            complete: function (data) {
                                var matches = data.responseText.match(/<title>(.*?)<\/title>/);
                                const nr = /<title>(.*?)<\/title>/g.exec(matches[0]);
                                titletobeAdded = nr[1];

                                chrome.storage.local.get('savetabs', function (data1) {

                                    if (data1.savetabs) {
                        
                                        var jsonData1 = JSON.parse(data1.savetabs);
        
                                        jsonData1.forEach(function(pro, id){
                                            if(pro.projectName == project.projectName){
                                                pro.projectData.push({title: titletobeAdded, url: urlToBeAdded});
                                            }
                                        });
                        
                                        chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData1) }, function () {
                        
                                            var notifOptions = {
                                                type: 'basic',
                                                iconUrl: 'icon48.png',
                                                title: titletobeAdded + " added!",
                                                message: titletobeAdded + " added successfully!"
                                            }
                        
                                            chrome.notifications.create('limitNotification', notifOptions);
                        
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else if (role == "open") {

                        project.projectData.forEach(function (tab, index) {
                            window.open(tab.url);
                        });

                        //console.log(project.projectName, role);
                    }
                    else {
                        console.log(project.projectName, role);
                    }
                });
            });
        }
    });

});