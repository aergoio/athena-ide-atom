-- should run with delegation fee not consume aergo of executor
-- should keep fee delegation state on checked and remove varargs

function run(arg, ...)
end

function check_delegation()
  return true
end

abi.register(run)
abi.fee_delegation(run)
