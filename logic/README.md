# Logic
```JSON
{
    "general": {
        "Brand": {
            "Brief": <Brand/README.md>,
        },
        "Topics-Covered": {
            "Graph": "
                <SWITCH: ="platform">
                <Topics/README.md/##Covered>
                <X>
                <Topics/README.md/###X>
                </X>
                <LinkedIn>
                <Topics/README.md/###LinkedIn>
                </LinkedIn>
                </SWITCH>
            ",
        },
        "All-Topics": {
            "Graph": "",
        },
        <SWITCH ="platform">
        <X>
        "last-ten-X-posts": {},
        "x-voice-guide": "",
        </X>
        <LinkedIn>
        "last-week's-LinkedIn-posts": {},
        "linkedin-voice-guide": "",
        </LinkedIn>
        </SWITCH>
        <SWITCH ="funnel">
        "funnel": {
            "full": <logic/Funnel/README.md>
            <SWITCH = "stage"
            "stage": {
                <Awareness>
                "Awareness": "" 
                </Awareness>
                <Interest> 
                "Interest": "" 
                </Interest>
                <Consideration>
                "Consideration": "" 
                </Consideration>
                <Conversion>
                "Conversion: "" 
                </Conversion>
                <Retention>
                "Retention": "" 
                </Retention>
                <Advocacy>
                "Advocacy": "" 
                </Advocacy>
            },
            <SWITCH = "stage">
        },
        </SWITCH>
    },
    "automations": {
        ...
    },
    "upgrading": {
        ...
    },
}
```

## General
Take all of this into consideration when writing your post.

If a stage of the marketing funnel has been specified, target a customer at 
that step when writing content. Write with specificity.

Everything you write should be from what makes us different, and be a focused
representation of how we are different. Emphasis on the sections in `Brand` 
marked `Differentiation`. Let this guide content. Do not liken our content to
other customers.

### Brand
m81

### Topics Covered
This is the knowledge graph of all the topics covered in m81s content
thus far. It is organized as a topic tree. Add to the tree when necessary,
if/when an automation requisites the addition of new topics to the tree. 

#### Graph
> ![NOTE]
> Should be the All Topics graph located at `Topics/README.md`

### All Topics
#### Graph
> ![NOTE]
> Should be the All Topics graph located at `Topics/README.md`

### Last Ten X Posts
> ![NOTE]
> Should be retrieved from redis

### X Voice Guide
<!-- TODO: Write Voice Guide -->

### Last Week's LinkedIn Posts
> ![NOTE]
> Should be retrieved from redis

### LinkedIn Voice Guide
<!-- TODO: Write Voice Guide -->

### Funnel
The general marketing funnel.

#### Awareness
This is the initial stage of the funnel, it is where

## Automations
### Processes
#### asoat
All Subtopics of a Topic
<!-- TODO: file -->
- Research a topic, comprehensively find all its subtopics

#### akioat
All Key Ideas of a Topic
<!-- TODO: file-->
- Get a list of all the key ideas of a topic, comprehensively explaining the 
topic 

#### wap
Write a Post
<!-- TODO: file -->
- The primary writer of posts

#### sepgfx
Singular Example Post Generation for X
- Pick a post from Posts and generate another based off that Post

#### ttgfx
<!-- TODO: file -->
Topic Thread Generation for X
- Generate a styled X thread

## Upgrading
These are the upgrades you can make to the engine. If you think an upgrade is
necessary, include it in your response. You may only use the following, 
restrict your system to only the upgrades you can make:

### Adding to Topics Covered
### Writing a New Engine Subsystem
Current subsystems include:
- General
- Automations
- Upgrading

Example:
```
<GENERAL>
```

### Writing a New Process
An example process:
- simple-example-post-generation-for-X.md

The contents of its file must conform to the syntax:
```markdown
# <PROCESS_NAME>
```JSON
{
    "<SOME_SUBCATEGORY>"
}
```

