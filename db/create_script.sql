create table Address(
    AddressId int not null primary key auto_increment,
    Street varchar(128) not null,
    City varchar(128) not null,
    PostalCode varchar(16) not null,
    Country varchar(64) not null,
    BuildingNumber varchar(16) not null,
    ApartmentNumber varchar(16)
);

create table User(
    UserId int not null primary key auto_increment,
    FirstName varchar(64) not null,
    LastName varchar(64) not null,
    login varchar(64) not null,
    Role varchar(1) not null default 'c',
    Email varchar(128) not null,
    PhoneNumber varchar(32) not null,
    IsActive char(1) not null default '1',
    CreateDate DATE not null default NOW(),
    LastOnline DATE not null default NOW(),
    Password varchar(128) not null,
    AddressId int not null ,
    credits int not null default 0,
    Foreign Key (AddressId) references Address(AddressId)
);

create table ExerciseType(
    ExerciseTypeId int not null primary key auto_increment,
    ExerciseTypeName varchar(64) not null,
    Category varchar(64) not null,
    BodyPart varchar(32) not null
);
create table WrkOutMachine(
    WrkOutMachineId int not null primary key auto_increment,
    MachineName varchar(64) not null,
    MaxWeight float,
    MinWeight float,
    MaxPeople int not null default 2,
    AvgTimeTaken int not null default 300, -- average after every reservation
    PopularityScore int not null default 0
);

create table MachineExerciseTypes(
    ExerciseTypeId int not null,
    WrkOutMachineId int not null,
    FOREIGN KEY (ExerciseTypeId) references ExerciseType(ExerciseTypeId),
    FOREIGN KEY (WrkOutMachineId) references WrkOutMachine(WrkOutMachineId),
    PRIMARY KEY (ExerciseTypeId, WrkOutMachineId)
);

create table WrkOutPlan(
    WrkOutPlanId int not null PRIMARY KEY auto_increment,
    PlanName varchar(64) not null,
    UserId int not null,
    foreign key (UserId) references User(UserId)
);

create table WrkOutPlanType(
    WrkOutPlanId int not null,
    ExerciseTypeId int not null,
    FOREIGN KEY (WrkOutPlanId) references WrkOutPlan(WrkOutPlanId),
    FOREIGN KEY (ExerciseTypeId) references ExerciseType(ExerciseTypeId),
    PRIMARY KEY (WrkOutPlanId, ExerciseTypeId)
);

create table WrkOutPlanMachines(
    WrkOutPlanId int not null,
    WrkOutMachineId int not null,
    WrkOutTime DATETIME not null,
    sets int not null default 4,
    reps int not null default 8,
    WrkOutStartTime TIME not null,
    WrkOutEndTime TIME not null,
    FOREIGN KEY (WrkOutPlanId) references WrkOutPlan(WrkOutPlanId),
    FOREIGN KEY (WrkOutMachineId) references WrkOutMachine(WrkOutMachineId),
    PRIMARY KEY (WrkOutPlanId, WrkOutMachineId)
);

create table Reservation(
    ReservetionId int not null auto_increment primary key ,
    AmmoutOfPeople int not null default 1,
    ReservationTime DATETIME not null,
    CustomerId int not null,
    TrainerId int,
    WrkOutPlanId int not null,
    FOREIGN KEY (CustomerId) references User(UserId),
    FOREIGN KEY (TrainerId) references User(UserId),
    FOREIGN KEY (WrkoutPlanId) references WrkOutPlan(WrkOutPlanId)
);

create table WrkOutPlanPreset(
    WrkOutPlanPresetId int not null primary key,
    PresetName varchar(64) not null,
    AuthorId int not null,
    FOREIGN KEY (AuthorId) references User(UserId)
)
create table WrkOutPlanMachinesPreset(
    WrkOutPlanPresetId int not null,
    WrkOutMachineId int not null,
    sets int not null default 4,
    reps int not null default 8,
    FOREIGN KEY (WrkOutPlanPresetId) references WrkOutPlanPreset(WrkOutPlanPresetId),
    FOREIGN KEY (WrkOutMachineId) references WrkOutMachine(WrkOutMachineId),
    PRIMARY KEY (WrkOutPlanPresetId, WrkOutMachineId)
);

create table test(
    id int not null primary key auto_increment,
    test varchar(64) not null
);