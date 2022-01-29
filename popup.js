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
        //console.log("tabsData", tabsData);
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

        //console.log("dataToBesaved", dataToBeSaved);

        chrome.storage.sync.get(['savetabs'], function (data) {

            var projectsData = [];

            var addData = {
                projectName: projectName,
                projectData: dataToBeSaved
            }

            projectsData.push(addData);

            //console.log('data', data);
            //console.log("savetabs", data.savetabs);
            //console.log(typeof data.savetabs);

            if(data.savetabs){
                //console.log("data is there", data.savetabs);

                var jsonData = JSON.parse(data.savetabs);
                //console.log("json data: ", jsonData);
                //console.log("projectsData: ", projectsData);
                //console.log("add tab in jason data", jsonData.push(addData));
                var projectsData1 = projectsData.concat(jsonData);
                //.console.log("projects data after adding json data", projectsData1);
                

                
                chrome.storage.sync.set({ 'savetabs': JSON.stringify(projectsData1) }, function () {

                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: projectName + " added!",
                        message: projectName + " saved successfully!"
                    }
    
                    chrome.notifications.create('limitNotification', notifOptions);
    
                });
            }
            else{
                console.log("no data availabel", data.savetabs);
                chrome.storage.sync.set({ 'savetabs': JSON.stringify(projectsData) }, function () {

                    var notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: projectName + " added!",
                        message: projectName + " saved successfully!"
                    }
    
                    chrome.notifications.create('limitNotification', notifOptions);
    
                });
            }

            console.log("projectsData", projectsData);
        })

    });

});