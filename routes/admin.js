var express = require("express");
var route = express.Router();
var exe = require("./../connection");

route.get("/",async function(req,res){
    var sql1 = `SELECT IFNULL(SUM(prize),0) AS total_donation_amount 
            FROM donar_information`;
    var sql2 = `SELECT COUNT(*) AS total_volunteers FROM volunteer`;
    var sql3 = `SELECT COUNT(*) aS upcoming_events FROM upcoming_event`;
     var sql4 = `
        SELECT 
            'volunteer' AS type,
            volunteer_name AS title,
            CONCAT(volunteer_name, ' registered as a new volunteer') AS description,
            created_at AS time
        FROM volunteer
        ORDER BY created_at DESC
        LIMIT 2
    `;
     var sql5 = `
        SELECT 
            'donation' AS type,
            'Donation Received' AS title,
            CONCAT('₹',prize, ' donation received') AS description,
            created_at AS time
        FROM donar_information
        ORDER BY created_at DESC
        LIMIT 2
    `;
     var sql6 = `
        SELECT 
            'event' AS type,
            program_title AS title,
            CONCAT('New event "', program_title, '" created') AS description,
            created_at AS time
        FROM past_event
        ORDER BY created_at DESC
        LIMIT 2
    `;
    var sql7 = `
        SELECT 
            'message' AS type,
            'New Message' AS title,
            CONCAT('Message received from ', name) AS description,
            created_at AS time
        FROM message
        ORDER BY created_at DESC
        LIMIT 2
    `;
    var data1 = await exe(sql1);
    var data2 = await exe(sql2);
    var data3 = await exe(sql3);
    var data4 = await exe(sql4);
    var data5 = await exe(sql5);
    var data6 = await exe(sql6);
    var data7 = await exe(sql7);
   

var activities = [
    ...data4,
    ...data5,
    ...data6,
    ...data7
];



// Sort by latest time
activities.sort((a, b) => new Date(b.time) - new Date(a.time));

 var obj = {
    total_donation_amount: data1[0].total_donation_amount,
    total_volunteers: data2[0].total_volunteers,
    upcoming_events: data3[0].upcoming_events,activities: activities
};

    res.render("admin/index.ejs",obj)
})

route.get("/program",function(req,res){
    res.render("admin/program.ejs")
})

// SAVE PROGRAM
route.post("/save_program", async function(req, res){

    var d = req.body;
    var FileName = "";

    // Image upload
    if(req.files && req.files.program_image){
        FileName = Date.now() + req.files.program_image.name;
        req.files.program_image.mv("public/" + FileName);
    }

    var sql = `
        INSERT INTO programs 
        (program_category, program_title, program_description, program_features, program_beneficiaries, program_image)
        VALUES
        (?,?,?,?,?,?)
    `;

    await exe(sql, [
        d.program_category,
        d.program_title,
        d.program_description,
        d.program_features,
        d.program_beneficiaries,
        FileName
    ]);

    res.redirect("/admin/program_list");
});


route.get("/program_list", async function(req, res){

    var sql = `SELECT * FROM programs ORDER BY created_at DESC`;
    var data = await exe(sql);

    res.render("admin/program_list.ejs", {
        program_list: data
    });
});


// EDIT PROGRAM PAGE
route.get("/program_edit/:id", async function(req, res){

    var id = req.params.id;

    var sql = `SELECT * FROM programs WHERE program_id = ?`;
    var data = await exe(sql, [id]);

    res.render("admin/program_edit.ejs", {
        program: data[0]
    });
});

// UPDATE PROGRAM
route.post("/update_program", async function(req, res){

    var d = req.body;
    var id = d.program_id;

    var imageName = d.old_image;

    if(req.files && req.files.program_image){
        imageName =Date.now()+ req.files.program_image.name;
        req.files.program_image.mv("public/" + imageName);
    }

    var sql = `
        UPDATE programs SET
        program_category = ?,
        program_title = ?,
        program_description = ?,
        program_features = ?,
        program_beneficiaries = ?,
        program_image = ?
        WHERE program_id = ?
    `;

    await exe(sql, [
        d.program_category,
        d.program_title,
        d.program_description,
        d.program_features,
        d.program_beneficiaries,
        imageName,
        id
    ]);

    res.redirect("/admin/program_list");
});

route.get('/program_delete/:id',async function(req, res){

    const sql = `DELETE FROM programs WHERE program_id = '${req.params.id}'`;
    var data = await exe(sql);
     res.redirect('/admin/program_list');
    });


route.get("/event",function(req,res){
    res.render("admin/event.ejs")
})

route.post("/save_upcoming_event",async function(req,res){
   var d = req.body;
    if(req.files){
        var FileName = Date.now()+req.files.event_image.name;
        req.files.event_image.mv("public/"+FileName);
    }
    var sql = `INSERT INTO upcoming_event(event_title,event_type,event_description,
    event_date,event_time,event_venue,event_capacity,event_price,event_image,event_status)
    VALUES
    ('${d.event_title}','${d.event_type}','${d.event_description}','${d.event_date}','${d.event_time}','${d.event_venue}','${d.event_capacity}','${d.event_price}','${FileName}','${d.event_status}')`;
    var data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/upcoming_event_list");
})


route.get("/upcoming_event_list", async function(req, res){
    var sql = `SELECT * FROM upcoming_event ORDER BY event_date ASC`;
    var sql1 = `SELECT * FROM past_event ORDER BY program_date DESC`;
    let data = await exe(sql);
    var data1 = await exe(sql1);
    var obj = {"upcoming_event":data, "past_event":data1}
    res.render("admin/upcoming_event_list.ejs",obj);
});

route.get("/upcoming_event_delete/:id", async function(req, res){
    var id = req.params.id;
    var sql = `DELETE FROM upcoming_event WHERE event_id='${id}'`;
    await exe(sql);
    res.redirect("/admin/upcoming_event_list");
});


route.get("/upcoming_event_edit/:id", async function(req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM upcoming_event WHERE event_id='${id}'`;
    var data = await exe(sql);
    var obj = {"upcoming_event":data}
    res.render("admin/upcoming_event_edit.ejs",obj);
});


route.post("/upcoming_event_edit/:id", async function(req, res){

    var id = req.params.id;
    var d = req.body;
    var FileName = d.old_image; // default old image

    if(req.files && req.files.event_image){
        FileName = Date.now() + req.files.event_image.name;
        req.files.event_image.mv("public/" + FileName);
    }

    var sql = `
        UPDATE upcoming_event SET
            event_title='${d.event_title}',
            event_type='${d.event_type}',
            event_description='${d.event_description}',
            event_date='${d.event_date}',
            event_time='${d.event_time}',
            event_venue='${d.event_venue}',
            event_capacity='${d.event_capacity}',
            event_price='${d.event_price}',
            event_status='${d.event_status}',
            event_image='${FileName}'
        WHERE event_id='${id}'
    `;

    await exe(sql);

    res.redirect("/admin/upcoming_event_list");
});

route.post("/save_past_event", async function (req, res) {
    var d = req.body;
    if(req.files){
        var FileName = Date.now()+req.files.program_image.name;
        req.files.program_image.mv("public/"+FileName);
    }

        let sql = `
            INSERT INTO past_event 
            (program_title, program_date, program_description, program_image)
            VALUES (?,?,?,?)
        `;

        let data = await exe(sql, [
            d.program_title,
            d.program_date,
            d.program_description,
            FileName
        ]);

        res.redirect("/admin/upcoming_event_list");

  
});

route.get("/past_event_edit/:id", async function(req, res){
    var id = req.params.id;
    var sql = `SELECT * FROM past_event WHERE program_id='${id}'`;
    var data = await exe(sql);
    var obj = {"event":data[0]}
    res.render("admin/past_event_edit.ejs",obj);
});


route.post("/past_event_update/:id", async function(req, res){

    var id = req.params.id;
    var d = req.body;

    var FileName = d.old_image;   // default old image

    if(req.files && req.files.program_image){
        FileName = Date.now() + req.files.program_image.name;
        req.files.program_image.mv("public/" + FileName);
    }

    var sql = `
        UPDATE past_event SET
        program_title = ?,
        program_date = ?,
        program_description = ?,
        program_image = ?
        WHERE program_id = ?
    `;

    await exe(sql, [
        d.program_title,
        d.program_date,
        d.program_description,
        FileName,
        id
    ]);

    res.redirect("/admin/upcoming_event_list");
});





route.get("/donation",async function(req,res){
    var sql = `SELECT * FROM donar_information`
    var data = await exe(sql);
    var obj = {"donor_info_list":data}
    res.render("admin/donation.ejs",obj)
})

route.get("/donar_info/:id",async function(req,res){
    var d = req.params.id;
    var sql = `SELECT * FROM donar_information WHERE donar_id = '${d}'`;
    var data = await exe(sql);
    var obj = {"donar":data}
    res.render("admin/donar_info.ejs",obj);
})

route.get("/delete/donar_info/:id",async function(req,res){
    var d = req.params.id;
    var sql = `DELETE FROM donar_information WHERE donar_id = '${d}'`
    var data = await exe(sql);
    res.redirect("/admin/donation")
})

route.get("/update/donor_info/:id",async function(req,res) {
    var d = req.params.id;
      var sql = `SELECT * FROM donar_information WHERE donar_id = '${d}'`;
      var data = await exe(sql);
       var obj = {"donar":data}
    res.render("admin/edit_donar_info.ejs",obj);

})

route.post("/update_donar/:id",async function(req,res){
    var d = req.body;
    var sql =  `UPDATE donar_information
    SET 
    donar_name= '${d.donar_name}',
    donar_email= '${d.donar_email}',
    donar_mobile= '${d.donar_mobile}',
    donation_for= '${d.donation_for}',
    prize= '${d.prize}' 
    WHERE donar_id = '${d.donar_id}'`
    var data = await exe(sql);
     res.redirect("/admin/donation")
     
    
})

route.get("/volunteer", async function(req, res){

    var pendingSql  = `SELECT * FROM volunteer WHERE status='pending'`;
    var acceptedSql = `SELECT * FROM volunteer WHERE status='accepted'`;
    var rejectedSql = `SELECT * FROM volunteer WHERE status='rejected'`;
    var totalSql    = `SELECT * FROM volunteer`;

    var pendingList  = await exe(pendingSql);
    var acceptedList = await exe(acceptedSql);
    var rejectedList = await exe(rejectedSql);
    var totalList    = await exe(totalSql);

    res.render("admin/volunteer.ejs",{
        pending_list  : pendingList,
        accepted_list : acceptedList,
        rejected_list : rejectedList,
        total_list    : totalList
    });
});


// ACCEPT
route.get("/volunteer_accept/:id", async function(req,res){
    var id = req.params.id;
    await exe(`UPDATE volunteer SET status='accepted' WHERE vounteer_id='${id}'`);
    res.redirect("/admin/volunteer");
});

// REJECT
route.get("/volunteer_remove/:id", async function(req,res){
    var id = req.params.id;
    await exe(`UPDATE volunteer SET status='rejected' WHERE vounteer_id='${id}'`);
    res.redirect("/admin/volunteer");
});


route.get("/volunteer_info/:id",async function(req,res){
    var d = req.params.id;
    var sql = `SELECT * FROM volunteer WHERE vounteer_id = '${d}'`;
    var data = await exe(sql);
    var obj = {"volunteer":data}
    res.render("admin/volunteer_info.ejs",obj);
})


route.get("/contact",async function(req,res){
    var sql =  `SELECT * FROM message`
    var data = await exe(sql);
    var obj = {"message_list":data}
    res.render("admin/contact.ejs",obj)
})

route.get("/message_delete/:id",async function(req,res){
    var sql =`DELETE FROM message WHERE message_id = '${req.params.id}'`;
    var data = await exe(sql);
    res.redirect("/admin/contact")
})


 
module.exports = route;
