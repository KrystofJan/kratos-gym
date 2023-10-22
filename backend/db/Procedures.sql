DROP PROCEDURE IF EXISTS ReduceCredits;
Create procedure if not exists ReduceCredits(In usrId int, In creditAmmout int)
BEGIN
    DECLARE oldCredits int;
    DECLARE newCredits int;
    START TRANSACTION ;
        set oldCredits = (select credits from User where UserId = usrId);
        set newCredits = oldCredits - creditAmmout;
        if oldCredits - creditAmmout >= 0 then
            Update User set User.credits =  newCredits where UserId = usrId;
        else
            rollback;
        end if;
    commit;
end;

DROP PROCEDURE IF EXISTS AddCredits;
Create procedure if not exists AddCredits(In usrId int, In creditAmmout int)
BEGIN
    Declare oldCredits int;
    DECLARE newCredits int;
    START TRANSACTION ;
        if creditAmmout <= 0 then
            set oldCredits = (select credits from User where UserId = usrId);
            set newCredits = oldCredits + creditAmmout;
            Update User set User.credits = newCredits where UserId = usrId;
        else
            rollback;
        end if;
    commit;
end;
