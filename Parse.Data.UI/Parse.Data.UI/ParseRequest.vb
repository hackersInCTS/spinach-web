Imports System.IO
Imports System.Web.Script.Serialization
Imports System.Net

Public Class ParseRequest

    Private request As WebRequest

    Public Sub New()

        Me.request = WebRequest.Create("https://api.parse.com/1/classes/TestObject")
        request.Method = "GET"
        request.ContentType = "application/x-www-form-urlencoded"
        request.Headers.Add(String.Format("X-Parse-Application-Id:{0}", "yMQl1IsnmiQZGS8TC1Y3mt4OQ05KwVxAZUvCvlD7"))
        request.Headers.Add(String.Format("X-Parse-REST-API-Key:{0}", "b5UuCBaHwYL0ohysqj8OdngQGQ1NVQStcxXchYp0"))
    End Sub

    Public Function GetResponse() As JSONResponse
        Dim response As WebResponse = request.GetResponse()
        Dim dataStream As Stream = response.GetResponseStream()
        Dim sr As New StreamReader(dataStream)
        Dim s As String = sr.ReadToEnd


        Dim serializer As New JavaScriptSerializer
        Return serializer.Deserialize(Of JSONResponse)(s)

    End Function

End Class
