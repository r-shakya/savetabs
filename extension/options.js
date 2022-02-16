$(function () {

    var tabsData = [];

    // show all projects
    chrome.storage.local.get('savetabs', function (data) {

        var projectsData = [];

        if (data.savetabs) {

            var projectsData = JSON.parse(data.savetabs);

            //console.log(projectsData);

            let text = "";
            let projectText = "";

            projectsData.forEach(function (project, index) {
                tabsData.push(project);

                projectText += `<option value="${index}">${project.projectName}</option>`

                text += `<div class="col-auto card mx-2 my-3" id="project">
                            <form id="project-${index}" action="" method="POST">
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
                                                    <td class="tab-name">${tab.title}</td>
                                                    <td>
                                                        <input type="checkbox" class="form-check-input" name="${i}" id="${project.projectName + "-tab-" + i}" checked> add
                                                    </td>
                                                </tr>`
                });
                text += `</tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row mb-3" id="projectBottom">
                                <hr>
                                <div class="col-6">
                                    <input type="text" class="form-control" id="tabUrl" name="tabUrl" placeholder="Enter URL">
                                </div>
                                <div class="col-3">
                                    <input type="submit" class="btn btn-primary submit-buttons" name="role" value="add" />
                                </div>
                                <div class="col-3">
                                    <input type="submit" class="btn btn-success submit-buttons" name="role" value="save" />
                                </div>
                            </div>
                        </form>
                    </div>`

            });

            if (projectText == "") {
                document.getElementById('fillProjectsName').innerHTML = '<option value="-1">No project Found</option>';
                document.getElementById("exportWarning").style.display = "none";
                document.getElementById("importBox").style.display = "block";
            }
            else {
                document.getElementById('fillProjectsName').innerHTML = projectText;
                document.getElementById("exportWarning").style.display = "block";
                document.getElementById("importBox").style.display = "none";
            }

            document.getElementById('fillProjects').innerHTML = text;

            let TasksText = "";

            projectsData.forEach(function (project, index) {

                TasksText += `<div class="col-auto card mx-2 my-3" id="project">
                            <form id="task-${index}" action="" method="POST">
                            <div class="row my-2">
                                <div class="col-6">
                                    <h3 class="project-name">${project.projectName}</h3>
                                </div>
                            </div>
                            <div class="taskBody row mb-3">
                                <div class="col">
                                    <textarea name="notes" placeholder="write here..." class="form-control">${project.notes}</textarea>
                                </div>
                            </div>
                            <div class="row mb-3" id="projectBottom">
                                <hr>
                                <div class="col d-grid gap-2">
                                    <input type="submit" class="btn btn-primary submit-buttons" name="role" value="save" />
                                </div>
                            </div>
                        </form>
                    </div>`

            });

            document.getElementById('fillTasks').innerHTML = TasksText;
            
            //export projects functionality
            let projectsToExport = "";
            projectsData.forEach(function (project, i) {
                projectsToExport += `<tr>
                                        <td class="tab-name">${project.projectName}</td>
                                        <td>
                                            <input type="checkbox" class="form-check-input submit-buttons" name="${i}" id="${project.projectName + "-tab-" + i}" checked>
                                        </td>
                                    </tr>`
            });
            document.getElementById('fillProjectsToExport').innerHTML = projectsToExport;

            // let projectsToImport = "";
            // projectsData.forEach(function (project, i) {
            //     projectsToImport += `<tr>
            //                             <td class="tab-name">${project.projectName}</td>
            //                             <td>
            //                                 <input type="checkbox" class="form-check-input submit-buttons" name="${i}" id="${project.projectName + "-tab-" + i}" checked>
            //                             </td>
            //                         </tr>`
            // });
            // document.getElementById('fillProjectsToImport').innerHTML = projectsToImport;

        }
        else{
            document.getElementById("importBox").style.display = "block";
        }

    });

    // open project
    $('#openProject').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        var w = $('#fillWindow').val();

        if (w == "1") {
            chrome.windows.create({}, function (wdata) {

                tabsData[projectId].projectData.forEach(function (tab, index1) {

                    chrome.tabs.create({ windowId: wdata.id, url: tab.url, index: 0 }, function (data) {

                    });

                });

            });
        }
        else {
            tabsData[projectId].projectData.forEach(function (tab, index) {
                window.open(tab.url);
            });
        }
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
                        iconUrl: 'icons/icon48.png',
                        title: spliced[0].projectName + " deleted!",
                        message: spliced[0].projectName + " deleted successfully!"
                    }

                    chrome.notifications.create('limitNotification', notifOptions);

                    window.location.reload();

                });
            }
        });
    });

    //iterate through all project and implement all functionality - add-tab,
    chrome.storage.local.get('savetabs', function (data) {

        if (data.savetabs) {

            var projectsData = JSON.parse(data.savetabs);

            projectsData.forEach(function (project, index) {

                $("#project-" + index).submit(function (e) {

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

                        chrome.tabs.create({ url: urlToBeAdded, index: 0, active: false }, function (tabData) {
                            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                                if (info.status === 'complete' && tabId === tabData.id) {
                                    chrome.tabs.query({ currentWindow: true }, function (tabs) {
                                        titletobeAdded = tabs[0].title;

                                        chrome.storage.local.get('savetabs', function (data1) {

                                            if (data1.savetabs) {

                                                var jsonData1 = JSON.parse(data1.savetabs);

                                                //can be done in one line, if we have project index
                                                jsonData1.forEach(function (pro, id) {
                                                    if (pro.projectName == project.projectName) {
                                                        pro.projectData.push({ title: titletobeAdded, url: urlToBeAdded });
                                                    }
                                                });

                                                //save the updated data
                                                chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData1) }, function () {

                                                    var notifOptions = {
                                                        type: 'basic',
                                                        iconUrl: 'icons/icon48.png',
                                                        title: titletobeAdded + " added!",
                                                        message: titletobeAdded + " added successfully!"
                                                    }

                                                    chrome.notifications.create('limitNotification', notifOptions);

                                                    chrome.tabs.remove( tabData.id, function(){
                                                        window.location.reload();
                                                    });

                                                });
                                            }
                                        });
                                    });

                                }
                            });
                        });

                    }
                    else if (role == "open") {

                        var tabsToBeOpen = [];

                        inputsData.forEach(function (obj, idx) {
                            if (obj.name != "tabUrl") {
                                var i = parseInt(obj.name);
                                tabsToBeOpen.push(project.projectData[i]);
                            }
                        });

                        chrome.windows.create({}, function (wdata) {

                            tabsToBeOpen.forEach(function (tab, index1) {

                                chrome.tabs.create({ windowId: wdata.id, url: tab.url, index: 0 }, function (data) {

                                });

                            });

                        });

                    }
                    else if (role == "save") {

                        var tabsToBeSave = [];

                        inputsData.forEach(function (obj, idx) {
                            if (obj.name != "tabUrl") {
                                var i = parseInt(obj.name);
                                tabsToBeSave.push(project.projectData[i]);
                            }
                        });

                        chrome.storage.local.get(['savetabs'], function (data2) {

                            if (data2.savetabs) {

                                var jsonData2 = JSON.parse(data2.savetabs);
                                jsonData2[index].projectData = tabsToBeSave;

                                chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData2) }, function () {

                                    var error = chrome.runtime.lastError;

                                    if (error) {
                                        alert(error.message);
                                    }

                                    else {
                                        var notifOptions = {
                                            type: 'basic',
                                            iconUrl: 'icons/icon48.png',
                                            title: project.projectName + " changed!",
                                            message: project.projectName + " tabs saved successfully!"
                                        }

                                        chrome.notifications.create('limitNotification', notifOptions);

                                        window.location.reload();
                                    }

                                });
                            }

                        });
                    }
                });


                $("#task-" + index).submit(function (e) {

                    e.preventDefault();

                    var inputsData = $(this).serializeArray();

                    // Get the submit button element
                    var btn = $(this).find("input[type=submit]:focus");
                    var role = btn[0].value;

                    if (role == "save") {

                        var notesToBeAdded = "";

                        inputsData.forEach(function (obj, idx) {
                            if (obj.name == "notes") {
                                notesToBeAdded = obj.value;
                            }
                        });

                        chrome.storage.local.get('savetabs', function (data1) {

                            if (data1.savetabs) {

                                var jsonData1 = JSON.parse(data1.savetabs);

                                //can be done in one line, if we have project index
                                jsonData1.forEach(function (pro, id) {
                                    if (pro.projectName == project.projectName) {
                                        pro.notes = notesToBeAdded;
                                    }
                                });

                                //save the updated data
                                chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData1) }, function () {

                                    var notifOptions = {
                                        type: 'basic',
                                        iconUrl: 'icons/icon48.png',
                                        title: "note saved!",
                                        message: "note has been changed successfully!"
                                    }

                                    chrome.notifications.create('limitNotification', notifOptions);

                                    window.location.reload();

                                });
                            }
                        });

                    }
                });
            });
        }
    });


    // export projects
    $('#exportData').click(function () {

        chrome.storage.local.get('savetabs', function (data) {

            if (data.savetabs) {

                var jsonData = JSON.parse(data.savetabs);
                var exportName = "savetabs";

                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", exportName + ".json");
                downloadAnchorNode.click();
                downloadAnchorNode.remove();

            }
        });
    });

    // import projects
    $('#importData').click(function () {
        document.getElementById('upload').click();
    });

    document.getElementById('upload').addEventListener('change', handleFileSelect, false);

    function handleFileSelect(e) {

        // FileList object
        let files = e.target.files;

        // use the 1st file from the list
        let f = files[0];

        // make file reader object
        let reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var data1 = e.target.result;
                var jsonData1 = JSON.parse(data1);

                chrome.storage.local.get(['savetabs'], function (data2) {

                    if (data2.savetabs) {

                        var jsonData2 = JSON.parse(data2.savetabs);
                        var dataToBeSaved = jsonData2.concat(jsonData1);

                        chrome.storage.local.set({ 'savetabs': JSON.stringify(dataToBeSaved) }, function () {

                            var error = chrome.runtime.lastError;

                            if (error) {
                                alert(error.message);
                            }

                            else {
                                var notifOptions = {
                                    type: 'basic',
                                    iconUrl: 'icons/icon48.png',
                                    title: f.name + " imported!",
                                    message: "projects imported successfully!"
                                }

                                chrome.notifications.create('limitNotification', notifOptions);
                            }

                        });
                    }
                    else{

                        chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData1) }, function () {

                            var error = chrome.runtime.lastError;

                            if (error) {
                                alert(error.message);
                            }

                            else {
                                var notifOptions = {
                                    type: 'basic',
                                    iconUrl: 'icons/icon48.png',
                                    title: f.name + " imported!",
                                    message: "projects imported successfully!"
                                }

                                chrome.notifications.create('limitNotification', notifOptions);
                            }

                        });
                    }

                    window.location.reload();

                });
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }

    $('#importData2').click(function () {
        document.getElementById('upload2').click();
    });

    document.getElementById('upload2').addEventListener('change', handleFileSelect2, false);

    function handleFileSelect2(e) {

        // FileList object
        let files = e.target.files;

        // use the 1st file from the list
        let f = files[0];

        // make file reader object
        let reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var data1 = e.target.result;
                var jsonData1 = JSON.parse(data1);

                let projectsToImport = "";
                jsonData1.forEach(function (project, i) {
                    projectsToImport += `<tr>
                                            <td class="tab-name">${project.projectName}</td>
                                            <td>
                                                <input type="checkbox" class="form-check-input submit-buttons" name="${i}" id="${project.projectName + "-tab-" + i}" checked>
                                            </td>
                                        </tr>`
                });
                document.getElementById('fillProjectsToImport').innerHTML = projectsToImport;
                document.getElementById("importProjectsBox").style.display = "block";
                return;
                //document.getElementById("importBox").style.display = "none";

                chrome.storage.local.get(['savetabs'], function (data2) {

                    if (data2.savetabs) {

                        var jsonData2 = JSON.parse(data2.savetabs);
                        var dataToBeSaved = jsonData2.concat(jsonData1);

                        chrome.storage.local.set({ 'savetabs': JSON.stringify(dataToBeSaved) }, function () {

                            var error = chrome.runtime.lastError;

                            if (error) {
                                alert(error.message);
                            }

                            else {
                                var notifOptions = {
                                    type: 'basic',
                                    iconUrl: 'icons/icon48.png',
                                    title: f.name + " imported!",
                                    message: "projects imported successfully!"
                                }

                                chrome.notifications.create('limitNotification', notifOptions);
                            }

                        });
                    }
                    else{

                        chrome.storage.local.set({ 'savetabs': JSON.stringify(jsonData1) }, function () {

                            var error = chrome.runtime.lastError;

                            if (error) {
                                alert(error.message);
                            }

                            else {
                                var notifOptions = {
                                    type: 'basic',
                                    iconUrl: 'icons/icon48.png',
                                    title: f.name + " imported!",
                                    message: "projects imported successfully!"
                                }

                                chrome.notifications.create('limitNotification', notifOptions);
                            }

                        });
                    }

                    window.location.reload();

                });
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }

});