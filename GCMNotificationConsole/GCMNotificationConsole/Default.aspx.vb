Imports System.Net
Imports System.Net.Security
Imports System.IO
Imports System.Security.Cryptography.X509Certificates

Public Class _Default
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub

    Private Sub TestNotification_Click(sender As Object, e As System.EventArgs) Handles TestNotification.Click
        Response.Text = SendNotification()
    End Sub

    Private Function SendNotification() As String
        ServicePointManager.ServerCertificateValidationCallback =
            Function(sender As Object, certificate As X509Certificate, chain As X509Chain, sslPolicyErrors As SslPolicyErrors) True
        Dim request As WebRequest = WebRequest.Create("https://android.googleapis.com/gcm/send")
        request.Method = "POST"
        request.ContentType = "application/x-www-form-urlencoded"
        request.Headers.Add(String.Format("Authorization: key={0}", ApiKey.Text))
        'Dim collaspeKey As String = Guid.NewGuid().ToString("n")
        'Dim postData As String = String.Format("registration_id={0}&data.payload={1}&collapse_key={2}", DeviceId.Text, Payload.Text, collaspeKey)
        Dim postData As String = String.Format("registration_id={0}&data.payload={1}", DeviceId.Text, Payload.Text)
        Dim byteArray As Byte() = Encoding.UTF8.GetBytes(postData)
        request.ContentLength = byteArray.Length
        Dim dataStream As Stream = request.GetRequestStream()
        dataStream.Write(byteArray, 0, byteArray.Length)
        dataStream.Close()
        Dim response As WebResponse = request.GetResponse()
        dataStream = response.GetResponseStream()
        Dim reader As New StreamReader(dataStream)
        Dim responseFromServer As String = reader.ReadToEnd()
        reader.Close()
        dataStream.Close()
        response.Close()

        Return responseFromServer
    End Function

End Class