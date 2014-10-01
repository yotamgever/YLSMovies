namespace MovieTheater.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Country",
                c => new
                    {
                        CountryID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Latitude = c.Double(nullable: false),
                        Longitude = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.CountryID);
            
            AddColumn("dbo.Users", "Country_CountryID", c => c.Int());
            AddForeignKey("dbo.Users", "Country_CountryID", "dbo.Country", "CountryID");
            CreateIndex("dbo.Users", "Country_CountryID");
            DropColumn("dbo.Users", "Country");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Country", c => c.String());
            DropIndex("dbo.Users", new[] { "Country_CountryID" });
            DropForeignKey("dbo.Users", "Country_CountryID", "dbo.Country");
            DropColumn("dbo.Users", "Country_CountryID");
            DropTable("dbo.Country");
        }
    }
}
