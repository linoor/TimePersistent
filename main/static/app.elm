import Time exposing (..)
import Http exposing (..)
import Json.Decode as Json exposing (Decoder, (:=))
import StartApp
import Html exposing (..)
import Task exposing (..)
import Effects exposing (..)

-- MODEL

type alias Model = {
    timeStarted : Time
  }

init : (Model, Effects Action)
init = (Model 0.0, checkIfStarted)


-- UPDATE

type Action = Start (Maybe Time)
            | End
            | NoOp

decoder : Json.Decoder Time
decoder =
  let timeString =
        ("time_started" := Json.float)
  in
    "timeStarted" := timeString

actions : Signal.Mailbox Action
actions = Signal.mailbox NoOp

checkIfStarted : Effects Action
checkIfStarted =
  Http.get decoder "http://127.0.0.1:8080/voyage"
      |> Task.toMaybe
      |> Task.map Start
      |> Effects.task

update : Action -> Model -> (Model, Effects Action)
update action model =
  case action of
    NoOp -> (model, Effects.none)
    Start time -> (model, Effects.none)
    End -> (model, Effects.none)


-- VIEW
view : Signal.Address Action -> Model -> Html
view address model =
  div [] [text (toString model.timeStarted)]

app =
  StartApp.start { init = init, view = view, update = update, inputs = []}

main : Signal Html
main =
  app.html

port tasks : Signal (Task.Task Never ())
port tasks =
  app.tasks
