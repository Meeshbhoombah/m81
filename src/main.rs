use std::fs;

fn main() -> std::io::Result<()> {

    // TODO: Scheduled Postings
    // Should randomly choose from the types of posts available
    // - e.g.:
    //      + Mimic all time high posts
    //      + A notable person
    //      + On a notable event
    //      + etc.
    // TODO: schedule a job to run every Sunday
    // - Generation of 5 LinkedIn posts
    // TODO: schedule a job to run every day
    // - Generation of 3 X posts

    println!("Hello, world!");
    // TODO: read the README at logic/README.md
    let e = fs::read_to_string("./logic/README.md")?;
    println!("{}", e);
    // parse first JSON block as logic
    // read in lowercased h2s, ensure they match with the logic in the JSON, write
    // an error to the frontend stating that theres a mismatch in the engine 
    // logic
    // read in h3s, if a found header is followed by a paragraph text, read that
    // in and attach the label "info"


    Ok(())
    
}
