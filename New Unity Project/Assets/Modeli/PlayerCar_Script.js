var FrontLeftWheel : WheelCollider;
var FrontRightWheel : WheelCollider;

// Brzine
var GearRatio : float[];
var CurrentGear : int = 0;

// varijable za torziju i max i min obrtaja motora
var EngineTorque : float = 230.0;
var MaxEngineRPM : float = 3000.0;
var MinEngineRPM : float = 1000.0;
private var EngineRPM : float = 0.0;



function Start () {
	// centar mase
GetComponent.<Rigidbody>().centerOfMass += Vector3(0, -.75, .25);
    }

function Update () {
	
		// obrtaja po min
	EngineRPM = (FrontLeftWheel.rpm + FrontRightWheel.rpm)/2 * GearRatio[CurrentGear];
	ShiftGears();

	// nesto za audio skunuo sa neta
	GetComponent.<AudioSource>().pitch = Mathf.Abs(EngineRPM / MaxEngineRPM) + 1.0 ;
	// ogranicava maximalni jauk da kazemo xD
	if ( GetComponent.<AudioSource>().pitch > 2.0 ) {
		GetComponent.<AudioSource>().pitch = 2.0;
	}

	// primenjivanje na tockove *torzija*
	FrontLeftWheel.motorTorque = EngineTorque / GearRatio[CurrentGear] * Input.GetAxis("Vertical");
	FrontRightWheel.motorTorque = EngineTorque / GearRatio[CurrentGear] * Input.GetAxis("Vertical");
		
	// ugao okretanja
	FrontLeftWheel.steerAngle = 10 * Input.GetAxis("Horizontal");
	FrontRightWheel.steerAngle = 10 * Input.GetAxis("Horizontal");
}

function ShiftGears() {
	// automatsko menjanje brzina i provera da li su obrtaji u zadatim vrednostima
	if ( EngineRPM >= MaxEngineRPM ) {
		var AppropriateGear : int = CurrentGear;
		
		for ( var i = 0; i < GearRatio.length; i ++ ) {
			if ( FrontLeftWheel.rpm * GearRatio[i] < MaxEngineRPM ) {
				AppropriateGear = i;
				break;
			}
		}
		
		CurrentGear = AppropriateGear;
	}
	
	if ( EngineRPM <= MinEngineRPM ) {
		AppropriateGear = CurrentGear;
		
		for ( var j = GearRatio.length-1; j >= 0; j -- ) {
			if ( FrontLeftWheel.rpm * GearRatio[j] > MinEngineRPM ) {
				AppropriateGear = j;
				break;
			}
		}
		
		CurrentGear = AppropriateGear;
	}
}