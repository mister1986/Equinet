# EQUINET Ad Scenarios — Review App

This is a small local web app with a real Excel database behind it.
Nobody using the app ever sees or manages the `.xlsx` file directly —
the server owns it and reads/writes it automatically every time someone
approves an ad or edits a text field.

## How it works

- `server.py` — a small Flask server. Owns `equinet_database.xlsx`
  (created automatically on first run, seeded from `seed_data.json`).
- `index.html` — the app itself. On load it fetches the current state
  from the server; every click or text edit sends an automatic save —
  no file pickers, no downloads, no manual steps.
- `equinet_database.xlsx` — the real database. You can open it directly
  in Excel any time to see the raw data (one row per ad, one column per
  field), but you never need to for the app to work.

## Setup (one time)

```
pip install -r requirements.txt
```

## Run

```
python server.py
```

Then open **http://localhost:5000** in any browser (Chrome, Edge, Firefox,
Safari all work now, since the file handling happens on the server, not
in the browser).

## Sharing this with MK, Faezeh, and the manager

Right now this runs on one machine. For everyone to see the *same* live
data at the same time, the server needs to run somewhere all of you can
reach it — for example:

- Run it on a shared office machine or a small cloud server, and give
  everyone the URL (e.g. `http://<that-machine's-address>:5000`), or
- Deploy it to a hosting service (Render, Railway, PythonAnywhere, etc.)

Let me know if you'd like help setting up either of those — the app
itself doesn't need to change, just where `server.py` runs.

## Data model

`equinet_database.xlsx` has one sheet, `ReviewData`, with one row per ad
and these columns:

- `row`, `category`, `funnel`, `ceoApproved` — fixed reference data
- `mkApproved`, `faezehApproved`, `managerApproved` — the three approval
  checkboxes, toggled from the app
- `h_on`, `h_vo`, `p_on`, `p_vo`, `s_on`, `s_vo`, `proof_on`, `proof_vo`,
  `b_on`, `b_vo`, `cta_vo` — the editable on-screen text / voice-over
  fields for each of the 6 steps
- `<field>_editor` — who last edited that field (`mk`, `faezeh`, or
  `manager`), used to color the text in the app
