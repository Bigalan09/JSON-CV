# JSON CV
Create a Curriculum vitae (CV) using JSON.  Outputs as HTML and PDF.

## Install
```
npm install
```

## Configurations
`config.json`
```json
{
    "template": "darkknight"
}
```

`cv.json`
```json
{
    "profile": {
        "name": "John Smith",
        "phone": "01443 666333",
        "email": "john@gmail.com",
        "address": "132, My Street, Bigtown BG23 4YZ England",
        "social": {
            "website": "",
            "github": "",
            "linkedin": ""
        },
        "short_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis eros eu pulvinar commodo. Aenean commodo viverra magna, sed luctus urna elementum pretium. Donec bibendum erat vehicula augue accumsan congue. Aliquam fringilla molestie sapien, vitae dictum ligula vulputate ac. Nulla convallis turpis nec eros rhoncus vulputate. Duis laoreet, sem id tincidunt faucibus, magna nisi pellentesque dui, ac volutpat libero ipsum non orci. Nam elementum at ligula sed pharetra."
    },
    "education": [{
        "school": "University of Bigtown",
        "course": "BSc (Hons) Computer Science",
        "grade": "First",
        "modules": ["parallel and concurrent programming", "distributed computing"],
        "start_date": "2009",
        "end_date": "2013"
    }],
    "work_experience": [{
        "company": "University of Smalltown",
        "job_title": "Research Assistant",
        "start_date": "2012",
        "end_date": "2012",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis eros eu pulvinar commodo. Aenean commodo viverra magna, sed luctus urna elementum pretium. Donec bibendum erat vehicula augue accumsan congue. Aliquam fringilla molestie sapien, vitae dictum ligula vulputate ac. Nulla convallis turpis nec eros rhoncus vulputate. Duis laoreet, sem id tincidunt faucibus, magna nisi pellentesque dui, ac volutpat libero ipsum non orci. Nam elementum at ligula sed pharetra."
    }],
    "employment_history": [{
        "company": "Tech Company A",
        "job_title": "Senior Software Developer",
        "start_date": "2015",
        "end_date": "2018",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In facilisis eros eu pulvinar commodo. Aenean commodo viverra magna, sed luctus urna elementum pretium. Donec bibendum erat vehicula augue accumsan congue. Aliquam fringilla molestie sapien, vitae dictum ligula vulputate ac. Nulla convallis turpis nec eros rhoncus vulputate. Duis laoreet, sem id tincidunt faucibus, magna nisi pellentesque dui, ac volutpat libero ipsum non orci. Nam elementum at ligula sed pharetra."
    }],
    "interests": [{
        "title": "Work",
        "description": "NodeJS, C# (.NET)"
    }],
    "additional_information": "",
    "references": "Available on request."
}
```

## Themes
- darkknight
- chronological
