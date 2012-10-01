﻿<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="GCMNotificationConsole._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>GCM Notifications Console</title>
    <link type="text/css" rel="Stylesheet" href="Styles/Styles.css" />
</head>
<body>
    <form id="form1" runat="server">
    <div class="content">
        <div class="container">
            <div class="label">
                Project API Key (Google GCM Service):
            </div>
            <div class="field">
                <asp:TextBox ID="ApiKey" runat="server" Width="1200px">AIzaSyClnMZe7vhxQnKVY5BbV1O1RR4N9iBJEho</asp:TextBox>
            </div>
        </div>
        <div class="container">
            <div class="label">
                Payload Data
            </div>
            <div class="field">
                <asp:TextBox ID="Payload" runat="server" Width="1200px">{ "message" : "Hi! This is a message", "msgcnt" : "2345" }</asp:TextBox>
            </div>
        </div>
        <div class="container">
            <div class="label">
                Device Registration ID:
            </div>
            <div class="field">
                <asp:TextBox ID="DeviceId" runat="server" Width="1200px">APA91bHwINx2I0AM835g4pBkJJY6aDStN_rNmcgLewViDB_jiMEH5uYQnvY8TBBItkk3-EuoDfAM7mQclST1UMw1P1w-GkyOcHrzrYjzDYi9pWG2bguo7ZfFl0vm2XwMLdbim45blAWfYwBgT-VBWn2g_wv364Yk1Q</asp:TextBox>
            </div>
        </div>
        <div class="container">
            <div class="label">
                <asp:Button ID="TestNotification" runat="server" Text="Push GCM Notification" />
            </div>
            <div class="field">
                <div class="response">
                    Response from Google:
                    <asp:Label ID="Response" runat="server" Text=""></asp:Label>
                </div>
            </div>
        </div>
    </div>
    <div>
        Thanks to this <a href="http://stackoverflow.com/questions/11261718/gcm-push-notification-with-asp-net">
            StackOverflow question</a>
    </div>
    </form>
</body>
</html>
