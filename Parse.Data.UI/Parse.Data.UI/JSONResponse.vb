Imports System.Runtime.Serialization

<DataContract()>
Public Class JSONResponse
    <DataMember()>
    Public Property Results As List(Of TestObject)


End Class

<DataContract()>
Public Class TestObject
    <DataMember()>
    Public Property foo As String
    <DataMember()>
    Public Property createdAt As String
    <DataMember()>
    Public Property updatedAt As String
    <DataMember()>
    Public Property objectId As String
End Class