sequenceDiagram
participant Parchment
participant PMS
participant User

entryspacing 0.9
Parchment->Parchment: Create partner_id and partner_secret for new partner (PMS)
Parchment->PMS: Send partner_id and partner_secret

User->Parchment: Sign up to Parchment (via UI)
User->Parchment: Enable PMS integration

Parchment->User: Display organization_id and organization_secret

User->PMS: Enter organization_id and organization_secret from Parchment

PMS->Parchment: Call /validate to validate credentials and complete handshake

User->PMS: Enter user_id from Parchment

User->PMS: Open Patient Profile

PMS->Parchment: Make call to /token to generate temporary JWT

Parchment->PMS: Return token

PMS->Parchment: Make API calls using token

Parchment->PMS: Return JSON data
