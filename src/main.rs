use std::fs;

fn main() -> std::io::Result<()> {

    /*
    TODO: add open crate
    - make localhost:3000 URL from config (for a change if defaults are different);
    - open localhost:3000 in the default browser with the `open` crate
    */

    /*
    server.addr
    open::that(server.addr)?;
    */

    // TODO: Generate graph
    // Read `Topic/README.md`
    // - Should contain:
    //      + All topics
    //      + Visited topics on LinkedIn
    //      + Visited topics on X
    // - Check memory for all topics graph
    //      + If new nodes in graph (i.e.: a new Subtopic)
    //          * For each keyword (topic)
    //              - Comprehensively find all sub-topics, use the asoat 
    //              automation (All Subtopics of a Topic)
    //              - Update the graph in `Topics/README.md`
    //          * For each keyword
    //              - Create a sub-directory in /topic
    //              - Add a README.md for all ideas in the topic
    //              - e.g.:
    //                  ```
    //                  Topics
    //                      Subtopic 1
    //                          README.md (contains Subtopic 1's key ideas)
    //                              Subtopic 4
    //                              etc.
    //                      Subtopic 2
    //                      Subtopic 3
    //                  ```
    //              - In the README.md for a Subtopic, add a title and all key 
    //              ideas in bullet form
    //              - e.g.:
    //                  ```
    //                  # Subtopic 1
    //                  ## Key Ideas
    //                  ```

    /*
    TODO: Target a stage in the general markeing funnel, or have the engine
    take the funnel into consideration.
    - Awareness
    - Interest
    - Consideration
    - Conversion
    - Retention
    - Advocacy
    */

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
    //

    // TODO: read the README at logic/README.md
    let e = fs::read_to_string("./logic/README.md")?;
    println!("{}", e);
    // parse first JSON block as logic
    // read in lowercased h2s, ensure they match with the logic in the JSON, write
    // an error to the frontend stating that theres a mismatch in the engine 
    // logic
    // read in h3s, if a found header is followed by a paragraph text, read that
    // in and attach the label "info"
    //


    Ok(())
    
}
