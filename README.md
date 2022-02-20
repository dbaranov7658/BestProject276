# BestProject276
Overview:
	The FortisBC PIA Portal allows users to create and edit Privacy Impact Assessment forms. A PIA is a process which assists organizations in identifying and managing the privacy risks arising from new projects, initiatives, systems, processes, strategies, policies, business relationships, etc. 

Currently, the PIA process is very disorganized - forms are sent out as word documents between project managers, business analysts, external vendors and the Privacy Office. The product is disorganized and lacking decorum. We aim to centralize the PIA forms, and store them within a single page, instead of through scattered emails, resulting in an organized workflow and logically structured form. The main API we intend to use is Azure Active Directory, for cloud-based identity and access management. 

Credentialed FortisBC employees can sign up or log into the application and create, edit, share, delete, comment on, format, and submit a PIA form to the Privacy Officer, who will either accept or reject it. On approval, the PIA becomes read-only, and an email is sent to the submitter informing them of the fact. The proposed platform consolidates the PIAs, storing them on one platform instead of scattered emails, and streamlines the process by sending automated email notifications when a PIA is submitted.  It also allows the submitter and officer to communicate back and forth, by leaving comments on pending PIAs and notifying the other party via email, when a comment is left. Audiences for this project may include product managers, business analysts, vendors, and privacy officers, depending on its form.


Sample use cases:
We have two types of users: the general user (that submits the PIAs), and the Privacy Officer (that accepted it or rejected it)

Use case #1:  General user creates a new PIA

The user must be logged into the portal via Facebook, with the correct permissions. On the main page, they click on the “Create new PIA” button. They’re taken to a new page and prompted to answer questions. When the submitter is finished, the user clicks “submit”. The PIA is saved with a status of “Pending” and an email notification is sent to the Privacy Officer.

Use case #2: General user edits an existing PIA, comments on PIA

The submitter must be logged into the portal via Facebook, with the correct permissions. On the main page, they click on “Edit an existing PIA”. They’re taken to the PIA page, where they can edit their answers and leave comments. When he/she is finished making changes, he/she clicks “save. An email notification is sent to the Privacy Officer when a comment is made or a change is submitted.


Use case #3: Privacy Officer views all PIAs 

The privacy officer must be logged into the portal via Facebook, with the correct permissions. On the main page, the officer can view all existing PIAs, sorted by status, date edited, submitter name, etc.

Use case #4: Privacy Officer reviews and comments on PIAs, then approves or denies

The privacy officer must be logged into the portal via Facebook, with the correct permissions. On the main page, the officer clicks on the PIA he wants to review. He’s taken to the PIA page, where he can comment on the answers to request changes or ask clarifying questions. Once he is done reviewing the PIA, he can click “Approve” or “Reject”, and the PIA will be saved with the resulting status. An email notification is sent to the submitter when a comment is made or the PIA is approved/rejected.

Main success scenario: 

New users should be able to sign up, and existing users should be able to log in with the correct method, then be taken to a page with a list of existing  PIA’s (if any) sorted by date and status. The user may withdraw, edit a PIA and resubmit it for review or create a brand-new one. Upon submitting  it, the Privacy Officer shall be notified that a new  PIA is awaiting review via email. The Privacy Officer logs in and clicking on the PIA will allow the Privacy Officer to review, edit, and provide comments upon which a notification is sent to the submitter via email. The Privacy Officer then either rejects or accepts it, if the latter then the PIA becomes a read-only and an email notification is sent to the submitter that their PIA had been accepted.

Features:
Log in via Facebook (Using Facebook API)
Create new PIA
Edit existing PIA
Send email notifications to general users and Privacy Officer once something changes 
Generate PDF of the PIA

