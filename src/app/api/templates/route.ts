import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('zoba');
    const templates = await db.collection('templates').find({}).toArray();
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('zoba');
    
    // First, check if we already have templates
    const existingTemplates = await db.collection('templates').countDocuments();
    
    // Only insert templates if none exist
    if (existingTemplates === 0) {
      // Default templates
      const defaultTemplates = [
        {
          name: 'Simple Flowchart',
          type: 'flowchart',
          code: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B -->|No| E[End]`,
          isDefault: true
        },
        {
          name: 'Sequence Diagram',
          type: 'sequence',
          code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
          isDefault: true
        },
        {
          name: 'Class Diagram',
          type: 'class',
          code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`,
          isDefault: true
        },
        {
          name: 'State Diagram',
          type: 'stateDiagram',
          code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
          isDefault: true
        },
        {
          name: 'Entity Relationship',
          type: 'erDiagram',
          code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
          isDefault: true
        },
        {
          name: 'Gantt Chart',
          type: 'gantt',
          code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2024-01-12, 12d
    another task     :24d`,
          isDefault: true
        },
        {
          name: 'Pie Chart',
          type: 'pie',
          code: `pie title What about pie?
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
          isDefault: true
        }
      ];

      const experimentalTemplates = [
        {
          name: 'Journey Map',
          type: 'journey',
          code: `journey
    title User Journey Map
    section Sign Up
      Landing: 5: User
      Create Account: 3: User
      Email Verification: 4: User, System
    section First Time
      Tutorial: 4: User, System
      Create Diagram: 5: User
      Save Work: 3: User, System
    section Collaboration
      Share Link: 4: User
      Real-time Edit: 5: User, Team
      Export: 4: User`,
          isDefault: false,
          isExperimental: true
        },
        {
          name: 'Quadrant Chart',
          type: 'quadrantChart',
          code: `quadrantChart
    title Diagram Features Priority
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Strategic Projects
    quadrant-3 Time Sinks
    quadrant-4 Thankless Tasks
    Export: [0.3, 0.6]
    Real-time: [0.8, 0.9]
    Templates: [0.4, 0.5]
    Dark Mode: [0.2, 0.3]
    Collaboration: [0.7, 0.8]`,
          isDefault: false,
          isExperimental: true
        },
        {
          name: 'C4 Context Diagram',
          type: 'C4 Context',
          isExperimental: true,
          code: `C4Context
title System Context diagram for Banking System

Person(customer, "Customer", "A customer of ABC Bank")
Person(employee, "Bank Employee", "An employee of ABC Bank")
Person_Ext(auditor, "External Auditor", "Audits the bank's operations")

Enterprise_Boundary(b1, "ABC Bank") {
    System(banking_system, "Core Banking System", "Handles all core banking operations")
}

System_Ext(email_system, "Email System", "External email service provider")
System_Ext(crm_system, "CRM System", "Manages customer relationships")
System_Ext(payment_gateway, "Payment Gateway", "Processes external payments")

Rel(customer, banking_system, "Views account\ndetails and transactions")
Rel(employee, banking_system, "Manages customer\naccounts and transactions")
Rel(auditor, banking_system, "Audits transactions\nand operations")
Rel(banking_system, email_system, "Sends notifications\nand alerts")
Rel(banking_system, crm_system, "Updates customer\ninformation")
Rel(banking_system, payment_gateway, "Processes\npayments")

UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")`,
          isDefault: false
        },
        {
          name: 'Block Diagram (Beta)',
          type: 'flowchart',
          code: `flowchart LR
    subgraph Frontend
    UI[Web Interface]
    end
    
    subgraph Backend
    API[API Gateway]
    Auth[Authentication]
    Cache[Redis Cache]
    Queue[Message Queue]
    end
    
    subgraph Database
    DB[(MongoDB)]
    end
    
    UI --> API
    API --> Auth
    API --> Cache
    API --> Queue
    API --> DB
    Queue --> DB`,
          isExperimental: true
        },
        {
          name: 'XY Chart',
          type: 'xychart',
          code: `xychart-beta
    title "User Growth Over Time"
    x-axis [jan, feb, mar, apr, may, jun]
    y-axis "Users" 0 --> 1000
    line [50, 150, 300, 400, 700, 1000]
    bar [40, 120, 250, 350, 650, 950]`,
          isDefault: false,
          isExperimental: true
        },
        {
          name: 'Sankey Diagram',
          type: 'sankey-beta',
          code: `sankey-beta
Website Traffic,Direct,20
Website Traffic,Search,40
Website Traffic,Social,30
Website Traffic,Referral,10
Direct,Sign Up,5
Search,Sign Up,15
Social,Sign Up,10
Referral,Sign Up,3`,
          isDefault: false,
          isExperimental: true
        }
      ];

      // Insert templates only if collection is empty
      await db.collection('templates').insertMany(
        [...defaultTemplates, ...experimentalTemplates]
      );

      return NextResponse.json({ message: 'Templates initialized successfully' });
    }

    return NextResponse.json({ message: 'Templates already exist' });
  } catch (error) {
    console.error('Failed to initialize templates:', error);
    return NextResponse.json(
      { error: 'Failed to initialize templates' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db('zoba');
    
    // Drop the existing templates collection
    await db.collection('templates').drop().catch(() => {
      // Ignore error if collection doesn't exist
    });
    
    // Create a new collection
    await db.createCollection('templates');
    
    // Default templates
    const defaultTemplates = [
      {
        name: 'Simple Flowchart',
        type: 'flowchart',
        code: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B -->|No| E[End]`,
        isDefault: true
      },
      {
        name: 'Sequence Diagram',
        type: 'sequence',
        code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
        isDefault: true
      },
      {
        name: 'Class Diagram',
        type: 'class',
        code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`,
        isDefault: true
      },
      {
        name: 'State Diagram',
        type: 'stateDiagram',
        code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
        isDefault: true
      },
      {
        name: 'Entity Relationship',
        type: 'erDiagram',
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
        isDefault: true
      },
      {
        name: 'Gantt Chart',
        type: 'gantt',
        code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2024-01-12, 12d
    another task     :24d`,
        isDefault: true
      },
      {
        name: 'Pie Chart',
        type: 'pie',
        code: `pie title What about pie?
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
        isDefault: true
      }
    ];

    const experimentalTemplates = [
      {
        name: 'Journey Map',
        type: 'journey',
        code: `journey
    title User Journey Map
    section Sign Up
      Landing: 5: User
      Create Account: 3: User
      Email Verification: 4: User, System
    section First Time
      Tutorial: 4: User, System
      Create Diagram: 5: User
      Save Work: 3: User, System
    section Collaboration
      Share Link: 4: User
      Real-time Edit: 5: User, Team
      Export: 4: User`,
        isDefault: false,
        isExperimental: true
      },
      {
        name: 'Quadrant Chart',
        type: 'quadrantChart',
        code: `quadrantChart
    title Diagram Features Priority
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Quick Wins
    quadrant-2 Strategic Projects
    quadrant-3 Time Sinks
    quadrant-4 Thankless Tasks
    Export: [0.3, 0.6]
    Real-time: [0.8, 0.9]
    Templates: [0.4, 0.5]
    Dark Mode: [0.2, 0.3]
    Collaboration: [0.7, 0.8]`,
        isDefault: false,
        isExperimental: true
      },
      {
        name: 'C4 Context Diagram',
        type: 'C4 Context',
        isExperimental: true,
        code: `C4Context
title System Context diagram for Banking System

Person(customer, "Customer", "A customer of ABC Bank")
Person(employee, "Bank Employee", "An employee of ABC Bank")
Person_Ext(auditor, "External Auditor", "Audits the bank's operations")

Enterprise_Boundary(b1, "ABC Bank") {
    System(banking_system, "Core Banking System", "Handles all core banking operations")
}

System_Ext(email_system, "Email System", "External email service provider")
System_Ext(crm_system, "CRM System", "Manages customer relationships")
System_Ext(payment_gateway, "Payment Gateway", "Processes external payments")

Rel(customer, banking_system, "Views account\ndetails and transactions")
Rel(employee, banking_system, "Manages customer\naccounts and transactions")
Rel(auditor, banking_system, "Audits transactions\nand operations")
Rel(banking_system, email_system, "Sends notifications\nand alerts")
Rel(banking_system, crm_system, "Updates customer\ninformation")
Rel(banking_system, payment_gateway, "Processes\npayments")

UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")`,
        isDefault: false
      },
      {
        name: 'Block Diagram (Beta)',
        type: 'flowchart',
        code: `flowchart LR
    subgraph Frontend
    UI[Web Interface]
    end
    
    subgraph Backend
    API[API Gateway]
    Auth[Authentication]
    Cache[Redis Cache]
    Queue[Message Queue]
    end
    
    subgraph Database
    DB[(MongoDB)]
    end
    
    UI --> API
    API --> Auth
    API --> Cache
    API --> Queue
    API --> DB
    Queue --> DB`,
        isExperimental: true
      },
      {
        name: 'XY Chart',
        type: 'xychart',
        code: `xychart-beta
    title "User Growth Over Time"
    x-axis [jan, feb, mar, apr, may, jun]
    y-axis "Users" 0 --> 1000
    line [50, 150, 300, 400, 700, 1000]
    bar [40, 120, 250, 350, 650, 950]`,
        isDefault: false,
        isExperimental: true
      },
      {
        name: 'Sankey Diagram',
        type: 'sankey-beta',
        code: `sankey-beta
Website Traffic,Direct,20
Website Traffic,Search,40
Website Traffic,Social,30
Website Traffic,Referral,10
Direct,Sign Up,5
Search,Sign Up,15
Social,Sign Up,10
Referral,Sign Up,3`,
        isDefault: false,
        isExperimental: true
      }
    ];

    // Insert all templates
    await db.collection('templates').insertMany([...defaultTemplates, ...experimentalTemplates]);

    return NextResponse.json({ message: 'Templates collection reset successfully' });
  } catch (error) {
    console.error('Failed to reset templates:', error);
    return NextResponse.json(
      { error: 'Failed to reset templates' },
      { status: 500 }
    );
  }
} 