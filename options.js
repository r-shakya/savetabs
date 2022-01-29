$(function () {

    var tabsData=[];

    chrome.storage.sync.get('savetabs', function (data) {

        var projectsData = [];

        if (data.savetabs) {

            var jsonData = JSON.parse(data.savetabs);

            projectsData = jsonData;

            let text = "";
            let projectText="";

            projectsData.forEach(function (project, index) {
                tabsData.push(project);

                projectText+=`<option value="${index}">${project.projectName}</option>`

                text += `<div class="col-auto card" id="project">
                <div class="row m-3">
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
                <tbody id="fillTabs">
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
            <div class="row mb-3">
                <div class="col-6">
                    <input type="text" class="form-control" id="tabUrl" placeholder="Enter URL">
                </div>
                <div class="col-6">
                    <input id="addTab" type="submit" class="btn btn-primary" value="add">
                </div>
            </div>
        </div>`

            });

            document.getElementById('fillProjectsName').innerHTML = projectText;
            document.getElementById('fillProjects').innerHTML = text;
        }
    });

    // $('#p0').click(function () {
    //     tabsData.forEach(function(tab, index){
    //         console.log(tab.projectName);
    //     })
    // });

    $('#resetTotal').click(function () {
        var projectId = $('#fillProjectsName').val();
        projectId = parseInt(projectId);

        tabsData[projectId].projectData.forEach(function (tab, index) {
            window.open(tab.url);
        });
    });
});