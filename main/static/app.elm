import Time exposing (..)
import StartApp
import Html exposing (..)
import Html.Events as Events
import Task exposing (..)
import Effects exposing (..)
import Http
import Json.Decode as Decoder exposing ((:=))

server : String
server = "http://127.0.0.1:8000/"

type Action = NoOp
            | OnInit (Result Http.Error Int)
            | Start
            | OnStart (Result Http.RawError Http.Response)
            | Stop
            | OnStop (Result Http.RawError Http.Response)

type alias Model = {
    timeStarted : Time,
    errorMessage : String
  }

init : (Model, Effects Action)
init =
  (Model 0.0 "", checkIfStarted)

view : Signal.Address Action -> Model -> Html.Html
view address model =
  div [] [
         if model.timeStarted == 0 then
           button [Events.onClick address Start] [text "Start"]
         else
           button [Events.onClick address Stop] [text "Stop"]
  ]

decoder : Decoder.Decoder Int
decoder = "id" := Decoder.int

checkIfStarted : Effects Action
checkIfStarted =
  Http.get decoder (server ++ "voyage")
      |> Task.toResult
      |> Task.map OnInit
      |> Effects.task

postJson : String -> String -> Task Http.RawError Http.Response
postJson url body =
  Http.send Http.defaultSettings {
          verb = "POST",
          headers = [("Content-Type", "application/json"), ("Accept", "application/json")],
          url = url,
          body = Http.string body
        }

startVoyage : Effects Action
startVoyage =
  postJson (server ++ "start_voyage") """{"from_place": "asd", "to_place": "asd", "type": "bus", "note": "no note"}"""
      |> Task.toResult
      |> Task.map OnStart
      |> Effects.task

update : Action -> Model -> (Model, Effects.Effects Action)
update action model =
  case action of
    OnInit response  -> (model, Effects.none)
    Start            -> (model, startVoyage)
    OnStart response -> (model, Effects.none)
    _                -> (model, Effects.none)

app : StartApp.App Model
app = StartApp.start {
        init = init,
        inputs = [],
        update = update,
        view = view
      }

main : Signal.Signal Html.Html
main =
  app.html

port runner : Signal (Task.Task Never ())
port runner = app.tasks
