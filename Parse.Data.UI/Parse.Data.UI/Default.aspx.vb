Imports System.Net
Imports System.Net.Security
Imports System.IO
Imports System.Security.Cryptography.X509Certificates
Imports System.Web.Services

Public Class _Default
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim request As New ParseRequest
        Dim ds = request.GetResponse().Results
        Jqgrid1.DataSource = ds
        Jqgrid1.DataBind()
    End Sub
    <WebMethod()>
    Public Function SaveImage(ByVal objectKey As String, ByVal metadata As String) As String
        Dim file As HttpPostedFile = HttpContext.Current.Request.Files("recFile")
        If (file Is Nothing) Then
            Return Nothing
        End If
        Dim targetFilePath As String = file.FileName
        file.SaveAs(targetFilePath)
        Return file.FileName.ToString()
    End Function

End Class