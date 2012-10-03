<%@ Page Title="Home Page" Language="vb" MasterPageFile="~/Site.Master" AutoEventWireup="false"
    CodeBehind="Default.aspx.vb" Inherits="Parse.Data.UI._Default" %>

<%@ Register Assembly="Trirand.Web" Namespace="Trirand.Web.UI.WebControls" TagPrefix="cc1" %>



<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
   
     ....
    <link rel="stylesheet" type="text/css" media="screen" href="Styles/redmond/jquery-ui-1.8.24.custom.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="Styles/ui.jqgrid.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="Styles/chocolat.css" />
    ...
    <script src="Scripts/jquery-1.8.2.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.chocolat.js" type="text/javascript"></script>
   <script src="Scripts/jquery-ui-1.8.24.custom.min.js" type="text/javascript"></script>
    <script src="Scripts/i18n/grid.locale-en.js" type="text/javascript"></script>
    <script src="Scripts/jquery.jqGrid.min.js" type="text/javascript"></script>
    
    ...

</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    
    <cc1:JQGrid ID="Jqgrid1" runat="server">
    <Columns>
        <cc1:JQGridColumn DataField="objectId"></cc1:JQGridColumn>
        <cc1:JQGridColumn DataField="createdAt"></cc1:JQGridColumn>
        <cc1:JQGridColumn DataField="updatedAt"></cc1:JQGridColumn>
    </Columns>
    </cc1:JQGrid>
    <script>
        $(function () {
            $("#tabs").tabs();
        });
        $(function () {
            $('#photos a').Chocolat();
            
        });
	</script>



<div class="LossInfoSection">

<div id="tabs">
	<ul>
		<li><a href="#tabs-1">Loss Iformation</a></li>		
		<li><a href="#tabs-2">Photos</a></li>
        <li><a href="#tabs-3">Audio Notes</a></li>
        <li><a href="#tabs-4">Policy Information</a></li>
	</ul>
	<div id="tabs-1">
		<p>
        
        </p>
	</div>
	<div id="tabs-2">
		<p id="photos">
        <a href="Images/Blue hills.jpg" title="Rose" rel="title1">
		<img width="100" src="Images/Blue hills.jpg" />
	    </a>
	<a href="Images/Water lilies.jpg" title="Black">
		<img width="100" src="Images/Water lilies.jpg" />
	</a>
	<a href="Images/Winter.jpg" title="Orange">
		<img width="100" src="Images/Winter.jpg"/>
	</a>
    <a href="Images/Sunset.jpg" title="Orange">
		<img width="100" src="Images/Sunset.jpg"/>
	</a>
        </p>
	</div>
	<div id="tabs-3">
		<p></p>
		<p></p>
	</div>
    <div id="tabs-4">
		<p></p>
		<p></p>
	</div>
</div>

</div><!-- End demo -->


</asp:Content>
