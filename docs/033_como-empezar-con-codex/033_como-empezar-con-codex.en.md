---
content_id: "docs-como-empezar-con-codex"
locale: "en"
title: "How to get started with Codex: a guide to delegating real work to an AI agent"
description: "Learn how to set up Codex, create your first project, use safe permissions, and delegate real tasks step by step without losing control."
author: "AIPaths Academy"
publishedAt: "2026-05-04T12:07:45.977Z"
updatedAt: "2026-05-04T12:07:45.977Z"
tags:
  - ai-agents
  - codex
  - agentic-engineering
  - workflows
  - automation
---
There is a big difference between asking AI for help and delegating part of the work to it.

When you use ChatGPT in the traditional way, you usually write a question, get an answer, and decide what to do with it. That can already be very useful: it helps you think, organize ideas, explain concepts, or answer questions. But most of the work is still on your side. You copy, paste, open files, make changes, test, fix issues, and decide the next step.

Codex changes that dynamic because it is not designed only to answer. It is designed to work inside a context: a folder, a project, a set of files, a specific task, and a defined set of permissions. That is why it is more useful to think of it less as “a chatbot for programming” and more as an operational assistant that can read, modify, run, compare, and explain what it did.

The promise is not that Codex replaces your judgment. The promise is that it helps you turn tasks that used to feel slow or intimidating into more concrete working conversations. Instead of staring at a folder and not knowing where to start, you can ask it to inspect it. Instead of writing documentation from scratch, you can ask it for a first draft. Instead of manually reviewing a small change, you can ask it to find the exact point and suggest a fix.

This is especially valuable if you are just starting to use AI tools to build products, automate processes, or improve your operations. Maybe you have heard about agents, but you have not tried them yet because they sound too technical or risky. This guide is written for that exact moment: so you can understand what Codex is, why it matters, and how to run a first useful test without giving up control of your project.

## What Codex is, in simple terms

Codex is an OpenAI agent designed to work with projects. It can read files, understand a structure, suggest changes, edit content, run commands when appropriate, and explain the result. If you use it inside a development environment, it can also help you with code, tests, documentation, bugs, and automations.

The key word is “agent.” An agent does not only chat: it tries to complete a task within defined limits. That means it needs context, and it also needs constraints. If you give it a vague instruction, it will try to infer too much. If you give it a clear objective, a specific folder, and a way to validate the result, it becomes much more useful.

A good use of Codex feels more like working with a very fast junior assistant than asking a black box for magic. It can move quickly, but it still needs you to define the objective, review the result, and decide what gets accepted.

## Why it is worth trying

The main reason to use Codex is not “to code faster,” although that is one of its uses. The deeper reason is that it reduces the friction between an intention and a deliverable.

If you have an idea for a landing page, Codex can turn a brief into a first HTML file. If you have messy notes, it can turn them into a guide. If you have a project you do not understand, it can explain how it is organized. If you have a small error, it can help you locate it and suggest a correction. If you repeat the same report every week, it can help you turn that process into a more structured workflow.

For an entrepreneur, operator, or small team, that means less time lost on mechanical tasks and more capacity to test ideas. Not because Codex does everything perfectly, but because it accelerates the first 60% of the work: inspecting, organizing, suggesting, writing, editing, and validating the basics.

The important point is to start with the right expectations. Codex should not receive an instruction like “build my entire product” in your first session. That is too broad, hard to review, and easy to turn into frustration. The best way to learn is to give it a small, visible, reversible task. That way you can understand how it thinks, what it modifies, and what kinds of instructions produce better results.

## The principle before you start: control first, speed second

With AI agents, the temptation is to give them broad access just to “see what they can do.” That is the wrong path for learning.

The practical rule is this: start with a controlled folder, a small task, and default permissions. Codex does not need access to your entire computer to prove its value. In fact, the less critical the first folder is, the more relaxed you will be when reviewing the workflow.

If you work with code, use Git before asking for important changes. A checkpoint commit gives you a simple way to roll back. If you do not use Git, duplicate the folder or work with practice files. The point is that your first experience should not depend on blind trust. It should depend on your ability to review and revert.

Codex works best when you treat it as part of a work system: bounded context, clear instruction, reasonable permissions, and human review.

## Your first session with Codex

To begin, choose a comfortable surface. It can be the desktop app, your IDE extension, the CLI, or a cloud environment, depending on how you work. If you are a beginner, the simplest option is usually the app or the extension inside an editor where you already have your files.

Do not start with your most important project. Create a practice folder and add a few non-critical files: notes, a small CSV, an operations document, a simple landing page, or a script you want to understand. The folder matters because it defines the context. Codex does not work well in the abstract; it works much better when it can see concrete materials.

Before asking it to make changes, ask it to look. This first prompt is enough:

```text
Inspect this folder and tell me what you see. Then suggest one small task you can complete safely. Wait for my approval before making changes.
```

This prompt does something very valuable: it forces Codex to observe before acting. It also lets you verify whether it understood the context correctly. If it invents things, you correct it. If it suggests something too large, you ask it to break it down. If the proposal makes sense, only then do you move to the next step.

When you approve a task, do not say “improve this.” That instruction is too open. Tell it exactly what you want, what it should not touch, and how it should deliver the result.

For example, if you are working with documentation:

```text
Create a short README for this folder. It should explain what the folder contains, how to use the main files, and what a new person should review first. Do not change any code. At the end, tell me which files you read and which file you modified.
```

If you are working with data:

```text
Review this CSV and create a Markdown summary with the number of rows, the main columns, visible data quality issues, and cleanup recommendations. Do not modify the original CSV.
```

If you are working with code:

```text
Find one small, low-risk improvement. Before editing, explain what change you propose and how you would validate it. Wait for my approval.
```

The structure repeats: clear objective, clear limits, reviewable result.

## Projects, threads, and permissions without overcomplicating it

There are three concepts worth understanding from the start.

A project is the workspace you connect to Codex. Usually it will be a folder or repository. If that folder is huge, Codex can get confused or spend effort on irrelevant context. To begin, use small projects or clearly bounded folders.

A thread is a working conversation. You can think of it as a mission. In the same thread, you might first ask for an inspection, then a proposal, then a change, and finally a validation. The important thing is not to mix too many objectives in the same conversation. If you want to solve something else, open another thread.

Permissions define what Codex can do. In general, start with the default permissions and let it ask for approval when it needs something more. Do not use full access while you are learning. Full access can be useful in specific cases, but only when you understand the risk you are accepting.

The best signal that you are using these concepts well is that you can always answer three questions: which project Codex is looking at, what task it is trying to complete, and what permission you gave it to do that.

## How to review Codex's work

Review is where many people make mistakes. They see that Codex produced something, accept it quickly, and later discover that it touched more than necessary or solved the wrong problem.

Review the result the way you would review another person's work. Look at which files it read, which files it modified, what assumptions it made, and whether the result matches the original task. If there is a diff, read it before accepting it. If it ran a validation, check what it actually validated. If it could not validate the result, it should tell you why.

If something is close but not perfect, you do not need to start over. Give concrete feedback:

```text
The approach is good, but the README is too generic. Rewrite it for non-technical users, add a section called “How to use this in 5 minutes,” and do not change any other files.
```

Codex improves a lot when your corrections are specific. “I don't like it” does not help much. “The tone is too technical,” “there are not enough steps for beginners,” or “you touched files outside the scope” helps much more.

## How to increase the difficulty

Once you complete a first task without surprises, increase the difficulty gradually. The healthiest order is to move from reading to documentation, then to small changes, then to changes with tests, and finally to automations.

First ask it to explain projects, summarize files, or find risks without modifying anything. Then ask it to create documentation, organize notes, or turn a process into a guide. After that, you can ask for small changes: a missing validation, a narrow bug, or a low-risk improvement. Once you trust the workflow more, you can ask it to implement something with tests or run validations.

Automations come at the end, not the beginning. An automation makes sense when a task is specific, repeated often, and easy to review. For example: a weekly report, recurring data cleanup, a change summary, or a periodic documentation review.

## Useful use cases for entrepreneurs and small teams

Codex is not only for engineers. It is useful whenever you have files, context, and a result you want to produce.

You can use it to turn notes into a seven-day execution plan, transform a messy SOP into a clear guide, create a simple landing page from a brief, review an existing workflow and detect failure points, prepare a weekly report, or document how an automation works.

The key is not to ask, “do something good with this.” Ask for a concrete output. For example: “create a 7-day plan with priorities, pending decisions, and missing information.” Or: “turn this process into a guide with steps, owners, inputs, outputs, and a questions section.” The more concrete the deliverable is, the easier it is to review whether Codex did the job well.

## A simple template for good prompts

You do not need to memorize perfect prompts. You need to learn how to structure the work.

A good instruction for Codex usually includes five pieces: what you want to achieve, which files matter, which constraints it should respect, how to validate the result, and how it should summarize what it did.

You can use this template:

```text
Objective: [specific result].
Context: use [relevant files or folders].
Constraints: do not modify [X], do not invent [Y], ask if [Z] is missing.
Validation: run [test, lint, or review] or explain why it does not apply.
Delivery: summarize changes, modified files, risks, and next steps.
```

Example:

```text
Objective: add an FAQ section to the landing page.
Context: use index.html and the brief in docs/brief.md.
Constraints: do not change the overall design or add dependencies.
Validation: check that there is no duplicate text and no broken links.
Delivery: summarize what you changed, which file you touched, and what I should review.
```

This structure prevents most beginner problems because it forces you to define the work before it starts.

## Common mistakes when starting

The first mistake is asking for too much at once. If you ask for a complete app, a huge refactor, or an ambiguous automation, Codex may produce something, but it will be hard to know whether it is right. Split the work.

The second mistake is not defining success criteria. “Improve this project” does not mean anything concrete. “Reduce duplication in this file without changing behavior and explain how you validated it” does.

The third mistake is not reviewing permissions or changes. Codex can accelerate a lot, but you are still responsible for the result. Keep backups, use Git when you can, and review before accepting.

The fourth mistake is thinking that if the first answer was not perfect, the tool is useless. Most of the value appears when you learn to iterate: you give context, review, correct, narrow the scope, and ask again.

## What to do after your first test

When you complete your first task, do not obsess over finding the “perfect prompt.” The important thing is to build a habit of controlled delegation.

The habit is simple: choose a small task, provide context, define limits, review the result, and save what worked. Over time, you will identify repeatable tasks that can become more stable workflows: documentation, reports, change reviews, prototypes, file cleanup, or internal automations.

Codex becomes more valuable when you stop using it to test AI and start using it to move real work forward. Not because it does everything alone, but because it lets you delegate concrete parts of the work with enough control to move faster without losing judgment.

## Sources consulted

- OpenAI Academy: “How to get started with Codex”.
- OpenAI Academy: “What is Codex?”.
- OpenAI Academy: “Automations”.
- OpenAI Academy: “Top 10 uses for Codex at work”.
- OpenAI Developers: Codex overview, Quickstart, Prompting, Sandbox, and Codex app features.
