# Logic
```JSON
{
    "timezone": "",
    "general": {
        "Brand": {
            "Brief": <Brand/README.md>,
        },
        "Topics-Covered": {
            "Graph": "<SWITCH:>(##LinkedIn)(##X)</SWITCH>",
        },
        "All-Topics": {
            "Graph": "",
        },
        <SWITCH>
        <X>
        "last-ten-X-posts": {},
        "x-voice-guide": "",
        </X>
        <LinkedIn>
        "last-week's-LinkedIn-posts": {},
        "linkedin-voice-guide": "",
        </LinkedIn>
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

## Timezone
This should always be set to timezone our potential customers are in.
> ![CAUTION]
> hardcoded value
> EST

## General
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

## Automations
### Processes
#### wlpg
Weekly LinkedIn Post Generation
<!-- TODO: file -->
> ![IMPORTANT]
> Runs every Sunday

#### dxpg
Daily X Post Generation
<!-- TODO: file -->
> ![IMPORTANT]
> Runs every day

#### asoat
All Subtopics of a Topic
<!-- TODO: file -->
- Research a topic, comprehensively find all its subtopics

### akioat
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

